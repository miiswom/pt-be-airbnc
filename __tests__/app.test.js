const request = require("supertest");
const app = require("../app/app");
const db = require("../db/connection")
const {seed} = require("../db/seed");
const data = require("../db/data/test");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/properties", () => {
  test("200 - it should respond with an array of property objects", async () => {
    const res = await request(app).get('/api/properties');
    const { body: {properties} } = res;

    expect(res.status).toBe(200)
    expect(res.type).toBe("application/json");
    expect(properties).toBeArray()
  });

  test("200 - each property should contains keys of 'property_id', 'property_name', 'location', 'price_per_night' and 'host'", async () => {
    const res = await request(app).get('/api/properties');
    const { body: {properties} } = res;
    
    properties.forEach((property) => {
      expect(property).toContainAllKeys(['property_id', 'property_name', 'location', 'price_per_night','host'])
    })

  });

  test("200 - array of properties should be sorted by popularity in descending order", async () => {
    const res = await request(app).get('/api/properties');
    const { body: {properties} } = res;
    // --- BLOCKER --- 
    const sortedByPopularity = await db.query(`SELECT properties.property_id,
                                                      properties.name AS property_name,
                                                      location,
                                                      price_per_night,
                                                      CONCAT(first_name, ' ', surname) AS host
                                                  FROM properties
                                                  JOIN users
                                                  ON properties.host_id = users.user_id
                                                  JOIN favourites
                                                  ON properties.property_id = favourites.property_id
                                                  GROUP BY favourites.*, favourites.guest_id, favourites.property_id, properties.property_id, host
                                                  ORDER BY favourites.guest_id ASC;`)
    const { rows } = sortedByPopularity;
    expect(properties).toEqual(rows)
  })

  test("400 - sould respond with a object contaning the message 'Sorry, bad request'", async() => {
    const res = await request(app).get('/api/invalid/endpoint');
    const { body: {msg} } = res;
    expect(res.status).toBe(400)
    expect(msg).toBe('Sorry, bad request.');
  });

})