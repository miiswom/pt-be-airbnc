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
    const res = await request(app).delete('/api/reviews/properties/10');
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, invalid endpoint.')
  })
});

describe("INVALID METHODS /api/properties/:id/reviews", () => {
  test("405 - responds with a 'Sorry, method not allowed' error message", async () => {
    const methods = ['delete', 'put', 'patch']
    for (const method of methods) {
      const res = await request(app)[method]('/api/properties/1/reviews')
      const { body: { msg } } = res;
      expect(res.status).toBe(405);
      expect(msg).toBe('Sorry, method not allowed.')
    }
  })
});

describe("GET /api/properties/:valid_id/reviews", () => {
  test("200 - responds with a json which contains a property of 'reviews' and 'average_rating'", async () => {
    const res = await request(app).get('/api/properties/1/reviews')
    const { body } = res;
    expect(body).toContainAllKeys(['reviews', 'average_rating'])
  })

  test("200 - 'reviews' should be an array of reviews objects", async () => {
    const res = await request(app).get('/api/properties/1/reviews')
    const { body: { reviews } } = res;
    expect(reviews).toBeArray()
    reviews.forEach((review) => {
      expect(review).toBeObject()
    })
  });

  test("200 - each reviews object should contains properties of 'review_id', 'comment', 'rating', 'created_at', 'guest' and 'guest_avatar'", async () => {
    const res = await request(app).get('/api/properties/1/reviews')
    const { body: { reviews } } = res;
    reviews.forEach((review) => {
      expect(review).toContainAllKeys(['review_id', 'comment', 'rating', 'created_at', 'guest', 'guest_avatar'])
    })
  });

  test("404 :unavailable_id - responds with a 'Sorry, not found' error message", async () => {
    const res = await request(app).get('/api/properties/2000/reviews');
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, not found.')
  })

  test("400 :invalid_id - responds with a 'Sorry, bad request' error message", async () => {
    const res = await request(app).get('/api/properties/ksdjfndsk/reviews');
    const { body: { msg } } = res;
    expect(res.status).toBe(400)
    expect(msg).toBe('Sorry, bad request.')
  });
});