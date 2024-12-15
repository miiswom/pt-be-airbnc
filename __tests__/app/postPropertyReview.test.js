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
    const res = await request(app).post('/api/property/reviews/');
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, invalid endpoint.')
  })
});

describe("INVALID METHODS /api/properties/:id/favourite", () => {
  test("405 - responds with a json containing an error message 'Sorry, method not allowed'", async () => {
    const methods = [ 'put', 'patch']
    for (const method of methods) {
      const res = await request(app)[method]('/api/properties/1/reviews')
      const { body: { msg } } = res;
      expect(res.status).toBe(405);
      expect(msg).toBe('Sorry, method not allowed.')
    }
  })
});

describe("POST /api/properties/:id/reviews", () => {
  test("201 :valid_id - responds with an object containing properties of 'review_id', 'property_id', 'guest_id', 'rating', 'comment' and 'created_at'", async () => {
    const res = await request(app).post('/api/properties/1/reviews').send(
      {
        "guest_id": "4",
        "rating": "5",
        "comment": "Average..."
      }
    )
    const { body } = res;
    expect(res.status).toBe(201)
    expect(body).toContainAllKeys(['review_id', 'property_id', 'guest_id', 'rating', 'comment', 'created_at'])
  })

  test("404 :unavailable_id - responds with an object containing an error message 'Sorry, not found.'", async () => {
    const res = await request(app).post('/api/properties/99/reviews').send(
      {
        "guest_id": "4",
        "rating": "5",
        "comment": "Average..."
      }
    )
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, not found.')
  })
  test("400 :invalid_id - responds with an object containing an error message 'Sorry, bad request.'", async () => {
    const res = await request(app).post('/api/properties/kldn/reviews').send(
      {
        "guest_id": "4",
        "rating": "5",
        "comment": "Average..."
      }
    )
    const { body: { msg } } = res;
    expect(res.status).toBe(400)
    expect(msg).toBe('Sorry, bad request.')
  })
  test("404 [unavailable guest_id] - responds with a json containing an error message 'Sorry, not found.'", async () => {
    const res = await request(app).post('/api/properties/1/reviews').send(
      {
        "guest_id": "9999",
        "rating": "5",
        "comment": "Average..."
      }
    );
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, not found.')
  });
  test("400 [invalid guest_id] - responds with json containing an error message 'Sorry, bad request'", async () => {
    const res = await request(app).post('/api/properties/1/reviews').send(
      {
        "guest_id": "lkwenf",
        "rating": "5",
        "comment": "Average..."
      }
    );
    const { body: { msg } } = res;
    expect(res.status).toBe(400)
    expect(msg).toBe('Sorry, bad request.')
  });

  test("400 [invalid rating] - responds with a json containing an error message 'Sorry, bad request'", async () => {
    const res = await request(app).post('/api/properties/1/reviews').send(
      {
        "guest_id": "4",
        "rating": "asdsd",
        "comment": "Average..."
      }
    );
    const { body: { msg } } = res;
    expect(res.status).toBe(400)
    expect(msg).toBe('Sorry, bad request.')
  })
  test("404 [unvailable guest_id] - responds with a json containing an error message 'Sorry, not found'", async () => {
    const res = await request(app).post('/api/properties/1/reviews').send(
      {
        "guest_id": "9999",
        "rating": "5",
        "comment": "Average..."
      }
    );
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, not found.')
  })
});

// add test to limit rating number to 5 max
