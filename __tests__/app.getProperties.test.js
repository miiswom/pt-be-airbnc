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
    const res = await request(app).delete('/api/properrities/10');
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, invalid endpoint.')
  })
});

describe("INVALID METHODS /api/properties", () => {
  test("405 - respond with an error message 'Sorry, method not allowed.'", async () => {
    const methods = ['delete', 'put', 'patch']
    for (const method of methods) {
      const res = await request(app)[method]('/api/properties')
      const { body: { msg } } = res;
      expect(res.status).toBe(405);
      expect(msg).toBe('Sorry, method not allowed.')
    }
  })
});

describe("GET /api/properties", () => {
    test("200 - it should respond with an array of property objects", async () => {
      return request(app).get('/api/properties')
        .expect(200)
        .then(({ body: { properties } }) => {
          expect(properties).toBeArray()
        });
    });

    test("200 - each property should contains keys of 'property_id', 'property_name', 'location', 'price_per_night' and 'host'", async () => {
      const res = await request(app).get('/api/properties');
      const { body: { properties } } = res;
      properties.forEach((property) => {
        expect(property).toContainAllKeys(['property_id', 'property_name', 'location', 'price_per_night', 'host', 'image'])
      })
    });

    test("200 - array of properties should be sorted by popularity in descending order", async () => {
      const res = await request(app).get('/api/properties');
      const { body: { properties } } = res;
      expect(properties).toBeSortedBy('property_id')
    });
  });

  describe("GET /api/properties?maxprice=num", () => {
    test("200 - responds with an array of object which price_per_night is lower than the maxprice number", async () => {
      const res = await request(app).get('/api/properties?maxprice=100')
      const { body: { properties } } = res;
      properties.forEach((property) => {
        expect(Number(property.price_per_night)).toBeLessThan(100)
      })
    })

    test("404 - responds with an error message 'Sorry, not found.' if the num doesn't match any properties ", async () => {
      const res = await request(app).get('/api/properties?maxprice=5')
      const { body: { msg } } = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, not found.')

    })
  });

  describe("GET /api/properties?minprice=num", () => {
    test("200 - responds with an array of object which price_per_night is lower than the maxprice number", async () => {
      const res = await request(app).get('/api/properties?minprice=100')
      const { body: { properties } } = res;
      properties.forEach((property) => {
        expect(Number(property.price_per_night)).toBeGreaterThan(100)
      })
    });

    test("404 - responds with an error message 'Sorry, not found.' if the num doesn't match any properties", async () => {
      const res = await request(app).get('/api/properties?minprice=500')
      const { body: { msg } } = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, not found.')
    })
  });

  describe("GET /api/properties?sort=key", () => {
    test("200 - responds with an array of object sorted by the passed key", async () => {
      const res = await request(app).get('/api/properties?sort=price_per_night')
      const { body: { properties } } = res;
      expect(properties).toBeSortedBy('price_per_night', { coerce: true })
    });

    test("404 - responds with an error message 'Sorry, not found.' if the key doesn't match any valid query ", async () => {
      const res = await request(app).get('/api/properties?sort=invalid_key')
      const { body: { msg } } = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, not found.')
    })
  });

  describe("GET /api/properties?host=id", () => {
    test("200 - responds with an array of object sorted by host_id", async () => {
      const res = await request(app).get('/api/properties?host=id')
      const { body: { properties } } = res;
      expect(properties).toBeSorted('host', { coerce: true })
    });

    // what error can I encounter?
  });

  describe("GET /api/properties?sort=popularity", () => {
    test("200 - responds wtih an array of property objects sorted by (favourites) property_id", async () => {
      const res = await request(app).get('/api/properties?sort=popularity')
      const { body: { properties } } = res;
      expect(properties).toBeSortedBy('property_id')
    })
  });

  describe("GET /api/properties?order=ascending | descending", () => {
    test("200 - responds with an array sorted in ascending order", async () => {
      const resAscOrder = await request(app)
        .get('/api/properties?sort=price_per_night&order=ascending')
        .then(({ body: { properties } }) => { return properties })
      expect(resAscOrder).toBeSorted('price_per_night', { coerce: true })

      const resDescOrder = await request(app)
        .get('/api/properties?sort=price_per_night&order=descending')
        .then(({ body: { properties } }) => { return properties })
      expect(resDescOrder).toBeSorted('price_per_night', { descending: true }, { coerce: true })
    })
  });