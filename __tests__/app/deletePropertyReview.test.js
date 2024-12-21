const request = require("supertest");
const app = require("../../app/app");
const db = require("../../db/connection")
const { seed } = require("../../db/seed");
const data = require("../../db/data/test");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("INVALID endpoints", () => {
  test("400 - responds with a 'Sorry, invalid endpoint' error message", async () => {
    const res = await request(app).delete('/api/revisews/1');
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, invalid endpoint.')
  })
});

describe("INVALID METHODS /api/reviews/:id", () => {
  test("405 - responds with a json containing an error message 'Sorry, method not allowed'", async () => {
    const methods = ['get', 'put', 'post', 'patch']
    for (const method of methods) {
      const res = await request(app)[method]('/api/reviews/1')
      const { body: { msg } } = res;
      expect(res.status).toBe(405);
      expect(msg).toBe('Sorry, method not allowed.')
    }
  })
});

describe("DELETE /api/reviews/:id", () => {
  test("204 :valid_id - responds with a status code 204", async () => {
    const res = await request(app).delete('/api/reviews/1')
    expect(res.status).toBe(204)
  });

  test("404 :unavailable_id - responds with a json containing an error message 'Sorry, not found.'", async () => {
    const res = await request(app).delete('/api/reviews/10000')
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, not found.')
  });

  test("400 :invalid_id - responds with a json containing an error message 'Sorry, bad request'", async () => {
    const res = await request(app).delete('/api/reviews/sdds')
    const { body: { msg } } = res;
    expect(res.status).toBe(400)
    expect(msg).toBe('Sorry, bad request.')
  });
})


