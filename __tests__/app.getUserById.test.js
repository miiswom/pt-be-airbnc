const request = require("supertest");
const app = require("../app/app");
const db = require("../db/connection")
const { seed } = require("../db/seed");
const data = require("../db/data/test");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("INVALID ENDPOINTS", () => {
  test("404 - responds with a json containing a message 'Sorry, not found'", async () => {
    const res = await request(app).get('/api/usersss/1')
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, invalid endpoint.')
  })
});

describe("INVALID METHODS /api/users/:id", () => {
  test("405 - responds with a json containing a message 'Sorry, method not allowed'", async () => {
    const methods = ['delete', 'put', 'post']
    for (const method of methods) {
      const res = await request(app)[method]('/api/users/1')
      const { body: { msg } } = res;
      expect(res.status).toBe(405);
      expect(msg).toBe('Sorry, method not allowed.')
    }
  })
});

describe("GET /api/users/:id", () => {
  test("200 :valid_id - responds with an object containing the keys of 'user_id', 'first_name', 'surname', 'email', 'phone_number', 'avatar' and 'created_at'", async () => {
    const res = await request(app).get('/api/users/1')
    const { body: { user } } = res;
    expect(res.status).toBe(200)
    expect(user).toContainAllKeys(['user_id', 'first_name', 'surname', 'email', 'phone_number', 'avatar', 'created_at'])
  });

  test("404 :unavailable_id - responds with a json containing a message 'Sorry, not found'", async () => {
    const res = await request(app).get('/api/users/1000')
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, not found.')
  });
  // add test for veery high users id

  test("400 :invalid_id - responds with a json containing a message 'Sorry, bad request'", async () => {
    const res = await request(app).get('/api/users/banana')
    const { body: { msg } } = res;
    expect(res.status).toBe(400)
    expect(msg).toBe('Sorry, bad request.')
  })
});