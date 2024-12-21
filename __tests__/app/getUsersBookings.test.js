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
  test("404 - responds with a json containing a message 'Sorry, invalid endpoint.'", async () => {
    const res = await request(app).get('/api/users_bookings')
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, invalid endpoint.')
  })
});

describe("INVALID METHODS /api/users/:id/bookings", () => {
  test("405 - responds with an object containing a message 'Sorry, method not allowed'", async () => {
    const methods = ['delete', 'put', 'post', 'patch']
    for (const method of methods) {
      const res = await request(app)[method]('/api/users/1/bookings')
      const { body: { msg } } = res;
      expect(res.status).toBe(405);
      expect(msg).toBe('Sorry, method not allowed.')
    }
  })
});

describe("GET  /api/users/:id/bookings", () => {
  test("200 - :valid_id - responds with an array of bookings objects", async () => {
    const res = await request(app).get('/api/users/2/bookings')
    const { body: { bookings } } = res;
    expect(bookings).toBeArray()
    bookings.forEach((booking) => {
      expect(booking).toContainAllKeys([ 'booking_id', 'check_in_date', 'check_out_date', 'property_id', 'property_name', 'host', 'image'])
    })
  });

  test("404 - :unavailable_id - responds a json containing an error message 'Sorry, not found.'", async () => {
    const res = await request(app).get('/api/users/1/bookings')
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, not found.')
  });

  test("400 - :invalid_id - responds a json containing an error message 'Sorry, bad request.'", async () => {
    const res = await request(app).get('/api/users/invalid_typeof_id/bookings')
    const { body: { msg } } = res;
    expect(res.status).toBe(400)
    expect(msg).toBe('Sorry, bad request.')
  });
})