const request = require("supertest");
const app = require("../app/app");
const db = require("../db/connection")
const { seed } = require("../db/seed");
const data = require("../db/data/test");
const { fetchFavourites } = require("../app/models")
const numOfFavourites = async () => (await fetchFavourites()).length
beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET PROPERTIES", () => {
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
        expect(property).toContainAllKeys(['property_id', 'property_name', 'location', 'price_per_night', 'host'])
      })

    });

    test("200 - array of properties should be sorted by popularity in descending order", async () => {
      const res = await request(app).get('/api/properties');
      const { body: { properties } } = res;
      // --- BLOCKER --- 
      expect(properties).toBeSortedBy('property_id')
    });

    test("405 - respond with an error message 'Sorry, method not allowed.'", async () => {
      const res = await request(app).delete('/api/properties');
      const { body: { msg } } = res;
      expect(msg).toBe('Sorry, method not allowed.')
    })
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
    })

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
    })
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
});

describe("POST FAVOURITE", () => {
  describe("POST /api/properties/:id/favourite", () => {
    test("200 - responds with an object containing a successful message and the new favourite_id number", async () => {
      const res = await request(app).post('/api/properties/1/favourite').send({ "guest_id": "1" });
      const { body: { msg, favourite_id } } = res;
      expect(res.status).toBe(201)
      expect(msg).toBe('Property favourited successfully.')
      expect(favourite_id).toBe(await numOfFavourites())
    })
  })

    describe("POST /api/properties/:invalid_id/favourite", () => {
          test("404 - responds with an object containing a 'Sorry, not found' error message ", async () => {
      const res = await request(app).post('/api/properties/100000/favourite').send({ "guest_id": "99999999" });
      const { body: { msg } } = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, not found.')
    })
    })
});

describe("DELETE FAVOURITE", () => {
  describe("DELETE /api/properties/:id/favourite", () => {
    test("204 - responds with a status code of 204 and an empty body", async () => {
      const res = await request(app).delete('/api/properties/10/favourite');
      const { body } = res;
      expect(res.status).toBe(204)
      expect(body).toBeEmptyObject()
    })    })
    describe("DELETE /api/properties/:invalid_id/favourite", () => {
      test("404 - responds with a 'Sorry, not found' error message", async () => {
        const res = await request(app).delete('/api/properties/999999/favourite');
        const { body: { msg } } = res;
        expect(res.status).toBe(404)
        expect(msg).toBe('Sorry, not found.')
      })
    })
});

describe("GET PROPERTY", () => {
  describe("GET /api/properties/:id", () => {
    test("200 - respond with a property object", async () => {
      const res = await request(app).get('/api/properties/1');
      const { body : {property }} = res;
      expect(res.status).toBe(200)
      expect(property).toBeObject()
    });

    test("200 - property object should contains keys of 'property_id', 'property_name', 'location', 'price_per_night', 'description', 'host', 'host_avatar'", async () => {
      const res = await request(app).get('/api/properties/1');
      const { body: { property } } = res;
      for(const keys in property) {
        expect(property).toContainAllKeys(['property_id', 'property_name', 'location', 'price_per_night', 'description', 'host', 'host_avatar'])
      }
    });
  });
});