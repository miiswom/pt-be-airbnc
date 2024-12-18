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
  test("400 - responds with a 'Sorry, bad request' error message", async () => {
    const res = await request(app).delete('/api/book/:id');
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, invalid endpoint.')
  })
});

describe("INVALID METHODS /api/bookings/:id", () => {
  test("405 - responds with a json containing an error message 'Sorry, method not allowed'", async () => {
    const methods = ['get', 'put', 'post']
    for (const method of methods) {
      const res = await request(app)[method]('/api/bookings/:id')
      const { body: { msg } } = res;
      expect(res.status).toBe(405);
      expect(msg).toBe('Sorry, method not allowed.')
    }
  })
});

describe("DELETE/api/bookings/:id", () => {
    test("204 :valid_id - responds with a status code of 204 and an empty body", async () => {
      const res = await request(app).delete('/api/bookings/10');
      expect(res.status).toBe(204)
    })

    test("404 :invalid_typeofid - responds with a 'Sorry, bad request.' error message", async () => {
      const res = await request(app).delete('/api/bookings/banana');
      const { body: { msg } } = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    });

    test("404 :unavailable_id - responds with a 'Sorry, not found' error message", async () => {
      const res = await request(app).delete('/api/bookings/100');
      const { body: { msg } } = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, not found.')
    });
  });
