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
    const res = await request(app).post('/api/props/:id/booking')
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, invalid endpoint.')
  })
});

describe("INVALID METHODS /api/properties/:id/booking", () => {
  test("405 - responds with a json containing an error message 'Sorry, method not allowed'", async () => {
    const methods = ['get', 'put', 'patch']
    for (const method of methods) {
      const res = await request(app)[method]('/api/properties/:id/booking')
      const { body: { msg } } = res;
      expect(res.status).toBe(405);
      expect(msg).toBe('Sorry, method not allowed.')
    }
  })
});

describe("POST /api/properties/:id/booking", () => {
  test("201 :valid_id - responds with a success message and the booking_id number", async () => {
    const res = await request(app).post('/api/properties/1/booking').send(
      {
        "guest_id": "3",
        "check_in_date": "2024-12-24",
        "check_out_date": "2025-01-05"
      })
    const { body } = res;
    expect(res.status).toBe(201)
    expect(body).toContainKeys(['msg', 'booking_id'])
    expect(body.msg).toBe('Booking successful!')
  });

  test("404 - :unavailable_id - responds with a json containing an error message: 'Sorry, not found'", async () => {
    const res = await request(app).post('/api/properties/56/booking').send(
      {
        "guest_id": "3",
        "check_in_date": "2024-12-24",
        "check_out_date": "2025-01-05"
      })
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, not found.')
  });

  test("404 - [overlapping daterange] - responds with a json containing an error message: 'Sorry, overlapping dates.'", async () => {
    const bookingOneResponse = await request(app).post('/api/properties/1/booking').send(
      {
        "guest_id": "3",
        "check_in_date": "2024-12-24",
        "check_out_date": "2025-01-05"
      }).then(({ body }) => { return body })
    expect(bookingOneResponse.msg).toBe('Booking successful!')

    const bookingTwoResponse = await request(app).post('/api/properties/1/booking').send(
      {
        "guest_id": "3",
        "check_in_date": "2024-12-24",
        "check_out_date": "2025-01-05"
      }).then(({ body }) => { return body })
    expect(bookingTwoResponse.msg).toBe('Sorry, overlapping dates.')
  })

  describe("Invalid typeof guest_id | check_in_date | check_out_date", () => {
    test("400 - [invalid typeof guest_id] responds with a json containing a error message: 'Sorry, bad request.'", async () => {
      const res = await request(app).post('/api/properties/1/booking').send(
        {
          "guest_id": "orange",
          "check_in_date": "2024-12-24",
          "check_out_date": "2025-01-05"
        })
      const { body: { msg } } = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    });

    test("400 - [invalid typeof check_in_date] responds with a json containing a error message: 'Sorry, bad request.'", async () => {
      const res = await request(app).post('/api/properties/1/booking').send(
        {
          "guest_id": "3",
          "check_in_date": "1",
          "check_out_date": "2025-01-05"
        })
      const { body: { msg } } = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    });

    test("400 - [invalid typeof check_in_date] responds with a json containing a error message: 'Sorry, bad request.'", async () => {
      const res = await request(app).post('/api/properties/1/booking').send(
        {
          "guest_id": "3",
          "check_in_date": "2024-12-24",
          "check_out_date": "apple"
        })
      const { body: { msg } } = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    })
  });

  describe("Missing key of guest_id | check_in_date | check_out_date in body", () => {
    test("400 - [missing guest_id] responds with a json containing a error message: 'Sorry, bad request.'", async () => {
      const res = await request(app).post('/api/properties/5/booking').send(
        {
          "check_in_date": "2024-12-24",
          "check_out_date": "2025-01-05"
        })
      const { body: { msg } } = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    });

    test("400 - [missing check_in_date] responds with a json containing a error message: 'Sorry, bad request.'", async () => {
      const res = await request(app).post('/api/properties/5/booking').send(
        {
          "guest_id": "3",
          "check_out_date": "2025-01-05"
        })
      const { body: { msg } } = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    });

    test("400 - [missing check_out_date] responds with a json containing a error message: 'Sorry, bad request.'", async () => {
      const res = await request(app).post('/api/properties/5/booking').send(
        {
          "guest_id": "3",
          "check_in_date": "2025-01-05"
        })
      const { body: { msg } } = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    });
  });
})

