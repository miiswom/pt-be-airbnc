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
    const res = await request(app).get('/api/props/10/booking');
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, invalid endpoint.')
  })
});

describe("INVALID METHODS /api/properties/:id/bookings", () => {
  test("405 - respond with an error message 'Sorry, method not allowed.'", async () => {
    const methods = ['delete', 'put', 'patch', 'post']
    for (const method of methods) {
      const res = await request(app)[method]('/api/properties/1/bookings')
      const { body: { msg } } = res;
      expect(res.status).toBe(405);
      expect(msg).toBe('Sorry, method not allowed.')
    }
  });
});

describe("GET /api/properties/:id/bookings", ()=> {
  test("200 :valid_id - responds with a json containing a key of 'bookings' and 'property_id'", async () => {
    const res = await request(app).get('/api/properties/1/bookings')
    const { body } = res;
    expect(res.status).toBe(200)
    expect(body).toContainAllKeys(['bookings', 'property_id'])
  });

  test("200 - value of 'bookings' is an array of booking objects containing  keys of 'booking_id', 'check_in_date', 'check_out_date' and 'created_at'", async () => {
    const res = await request(app).get('/api/properties/1/bookings')
    const { body: {bookings}} = res;
    expect(res.status).toBe(200)
    bookings.forEach((booking) => {
      expect(booking).toContainAllKeys([ 'booking_id', 'check_in_date', 'check_out_date', 'created_at'])

    })
  })
  test("404 :unavailable_id - responds with an error message 'Sorry, not found.'", async () => {
    const res = await request(app).get('/api/properties/100/bookings')
    const { body: { msg }} = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, not found.')
  })
  test("400 :invalid_typeof_id - responds with an error message 'Sorry, bad request.'", async () => {
    const res = await request(app).get('/api/properties/invalid/bookings')
    const { body: { msg }} = res;
    expect(res.status).toBe(400)
    expect(msg).toBe('Sorry, bad request.')  
  })
} )