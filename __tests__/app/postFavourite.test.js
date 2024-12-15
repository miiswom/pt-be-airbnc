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

describe("INVALID ENDPOINTS", () => {
  test("404 - responds with a json containing a message 'Sorry, not found'", async () => {
    const res = await request(app).get('/api/favourite/properties/1')
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, invalid endpoint.')
  })
});

  // add test for invalid methods
  describe("INVALID METHODS /api/properties/:id/favourite", () => {
    test("405 - responds with a json containing an error message 'Sorry, method not allowed'", async () => {
      const methods = ['get', 'put', 'patch']
      for (const method of methods) {
        const res = await request(app)[method]('/api/properties/1/favourite')
        const { body: { msg } } = res;
        expect(res.status).toBe(405);
        expect(msg).toBe('Sorry, method not allowed.')
      }
    })
  });

  describe("POST /api/properties/:id/favourite", () => {
    test("201 :valid_id - responds with an object containing a successful message and the new favourite_id number", async () => {
      const res = await request(app).post('/api/properties/1/favourite').send({ "guest_id": "1" });
      const { body: { msg } } = res;
      expect(res.status).toBe(201)
      expect(msg).toBe('Property favourited successfully.');
    })
    test("404 :invalid_id - responds with an object containing a 'Sorry, not found' error message ", async () => {
      const res = await request(app).post('/api/properties/100000/favourite').send({ "guest_id": "99999999" });
      const { body: { msg } } = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, not found.')
  })
    test("400 :invalid_typeofid - responds with an object containing a 'Sorry, bad request' error message ", async () => {
      const res = await request(app).post('/api/properties/char/favourite').send({ "guest_id": "1" });
      const { body: { msg } } = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    })

    test("400 [invalid typeof guest_id] - responds with an object containing a 'Sorry, bad request' error message ", async () => {
      const res = await request(app).post('/api/properties/char/favourite').send({ "guest_id": "\safwff" });
      const { body: { msg } } = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    })
  })

