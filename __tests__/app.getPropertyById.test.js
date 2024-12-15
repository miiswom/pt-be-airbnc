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

describe("INVALID endpoints", () => {
  test("400 - responds with a 'Sorry, bad request' error message", async () => {
    const res = await request(app).delete('/api/ppproperties/10');
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, invalid endpoint.')
  })
});

describe("INVALID METHODS /api/properties/:id", () => {
  test("405 - respond with an error message 'Sorry, method not allowed.'", async () => {
    const methods = ['delete', 'put', 'patch',]
    for (const method of methods) {
      const res = await request(app)[method]('/api/properties/1')
      const { body: { msg } } = res;
      expect(res.status).toBe(405);
      expect(msg).toBe('Sorry, method not allowed.')
    }
  });
});

  describe("GET /api/properties/:id", () => {
    test("200 :valid_id - property objects should contains keys of 'property_id', 'property_name', 'location', 'price_per_night', 'description', 'host', 'host_avatar' and 'favourite_count'", async () => {
      const res = await request(app).get('/api/properties/1');
      const { body: { property } } = res;
      expect(res.status).toBe(200)
      expect(property).toContainAllKeys(['property_id', 'property_name', 'location', 'price_per_night', 'description', 'host', 'host_avatar', 'favourite_count', 'images'])
    });

    test("404 :unavailable_id - respond with an error message 'Sorry, not found.'", async () => {
      const res = await request(app).get('/api/properties/555555555551');
      const { body: { msg } } = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, not found.')
    });

    test("400 :invalid_id - respond with an error message 'Sorry, bad request.'", async () => {
      const res = await request(app).get('/api/properties/bftyfgu');
      const { body: { msg } } = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    });
});