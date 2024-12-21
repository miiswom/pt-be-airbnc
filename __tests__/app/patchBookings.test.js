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
    const res = await request(app).patch('/api/books/1')
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, invalid endpoint.')
  })
});

describe("INVALID METHODS  /api/bookings/:id", () => {
  test("405 - responds with an object containing a message 'Sorry, method not allowed'", async () => {
    const methods = ['get', 'put', 'post']
    for (const method of methods) {
      const res = await request(app)[method]('/api/bookings/1').send(
        {
          "check_in_date": "2025-01-01",
          "check_out_date": "2025-01-04"
        })
      const { body: { msg } } = res;
      expect(res.status).toBe(405);
      expect(msg).toBe('Sorry, method not allowed.')
    }
  })
});

describe("PATCH /api/bookings/:id", () => {
  test("200 :valid_id - responds with the update booking object", async () => {
    const res = await request(app).patch('/api/bookings/1').send(
      {
        "check_in_date": "2025-01-04",
        "check_out_date": "2025-01-07"
      })
    const { body: { booking } } = res;
    expect(res.status).toBe(200)
    expect(booking.check_in_date).toEqual("2025-01-04");
    expect(booking.check_out_date).toEqual("2025-01-07")
  });

  test("404 [overelapping daterange] - responds with a json message 'Sorry, not found.'", async () => {
    const bookingResponseOne = await request(app).patch('/api/bookings/1').send(
      {
        "check_in_date": "2025-01-01",
        "check_out_date": "2025-01-07"
      }).then(({ body }) => { return body })
    expect(bookingResponseOne.booking.check_in_date).toEqual("2025-01-01");
    expect(bookingResponseOne.booking.check_out_date).toEqual("2025-01-07")
    //console.log(bookingResponseOne)

    const bookingResponseTwo = await request(app).patch('/api/bookings/1').send(
      {
        "check_in_date": "2025-01-06",
        "check_out_date": "2025-01-10"
      }).then(({ body }) => { return body })
    expect(bookingResponseTwo.booking).toBeUndefined()
    expect(bookingResponseTwo.msg).toBe('Sorry, not found.');
  });

  test("400 :invalid_id - responds with a json containing an error message 'Sorry, bad request.'", async () => {
    const res = await request(app).patch('/api/bookings/invalid_id').send(
      {
        "check_in_date": "2025-01-04",
        "check_out_date": "2025-01-07"
      })
    const { body: { msg } } = res;
    expect(res.status).toBe(400)
    expect(msg).toBe('Sorry, bad request.')
  });

  test("404 :unavailable_id - responds with a json containing an error message 'Sorry, not found.'", async () => {
    const res = await request(app).patch('/api/bookings/999').send(
      {
        "check_in_date": "2025-01-04",
        "check_out_date": "2025-01-07"
      })
    const { body: { msg } } = res;
    expect(res.status).toBe(404)
    expect(msg).toBe('Sorry, not found.')
  });

  test("400 :invalid_typof_date - responds with a json containing an error message 'Sorry, bad request.'", async () => {
    const resA = await request(app).patch('/api/bookings/1').send(
      {
        "check_in_date": "invalid_typof_date",
        "check_out_date": "2025-01-07"
      }).then((body) => { return body })
    expect(resA.status).toBe(400)
    expect(resA.body.msg).toBe('Sorry, bad request.')

    const resB = await request(app).patch('/api/bookings/1').send(
      {
        "check_in_date": "2025-01-01",
        "check_out_date": "invalid_typof_date"
      }).then((body) => { return body })
    expect(resB.status).toBe(400)
    expect(resB.body.msg).toBe('Sorry, bad request.')
  });

  test("400 [missing dates in body] - responds with a json containing an error message 'Sorry, bad request.'", async () => {
    const resA = await request(app).patch('/api/bookings/invalid_id').send(
      {
        "check_in_date": "2025-01-07"
      }
    ).then((body) => {return body})
    expect(resA.status).toBe(400)
    expect(resA.body.msg).toBe('Sorry, bad request.');

    const resB = await request(app).patch('/api/bookings/invalid_id').send(
      {
        "check_out_date": "2025-01-07"
      }
    ).then((body) => {return body})
    expect(resB.status).toBe(400)
    expect(resB.body.msg).toBe('Sorry, bad request.')
  });
})