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
    test.only("200 :valid_id - responds with the update booking object", async () => {
      const res = await request(app).patch('/api/bookings/1').send(
        {
          "check_in_date": "2025-01-04",
          "check_out_date": "2025-01-07"
      })
      const { body: { booking } } = res;
      console.log(booking)
      expect(res.status).toBe(200)
      //expect(booking.check_in_date).toEqual("2025-01-01");
      //expect(booking.check_out_date).toEqual("2025-01-04")
    });
    test("200 - when patching surname only", async () => {
      const formerUser = await request(app).get('/api/users/1').then(({ body: { user } }) => { return user })
      const res = await request(app).patch('/api/users/1').send(
        {
          "surname": "TestB"
        }
      )
      const { body: { user } } = res;
      expect(user.surname).not.toEqual(formerUser.surname);
      expect(user.surname).toBe('TestB');
      expect(user.user_id).toEqual(formerUser.user_id)
      expect(user.first_name).toEqual(formerUser.first_name);
      expect(user.email).toEqual(formerUser.email)
      expect(user.phone).toEqual(formerUser.phone_number)
      expect(user.avatar).toEqual(formerUser.avatar)
    });
    test("200 - when patching email only", async () => {
      const formerUser = await request(app).get('/api/users/1').then(({ body: { user } }) => { return user })
      const res = await request(app).patch('/api/users/1').send(
        {
          "email": "testc@example.com"
        }
      )
      const { body: { user } } = res;
      expect(user.email).not.toEqual(formerUser.email);
      expect(user.email).toBe('testc@example.com');
      expect(user.user_id).toEqual(formerUser.user_id)
      expect(user.first_name).toEqual(formerUser.first_name);
      expect(user.surname).toEqual(formerUser.surname)
      expect(user.phone).toEqual(formerUser.phone_number)
      expect(user.avatar).toEqual(formerUser.avatar)
    });
    test("200 - when patching phone only", async () => {
      const formerUser = await request(app).get('/api/users/1').then(({ body: { user } }) => { return user })
      const res = await request(app).patch('/api/users/1').send(
        {
          "phone": "06123456789"
        }
      )
      const { body: { user } } = res;
      expect(user.phone).not.toEqual(formerUser.phone_number);
      expect(user.phone).toBe('06123456789');
      expect(user.user_id).toEqual(formerUser.user_id)
      expect(user.first_name).toEqual(formerUser.first_name);
      expect(user.email).toEqual(formerUser.email)
      expect(user.surname).toEqual(formerUser.surname)
      expect(user.avatar).toEqual(formerUser.avatar)
    });
    test("200 - when patching avatar only", async () => {
      const formerUser = await request(app).get('/api/users/1').then(({ body: { user } }) => { return user })
      const res = await request(app).patch('/api/users/1').send(
        {
          "surname": "TestB"
        }
      )
      const { body: { user } } = res;
      expect(user.surname).not.toEqual(formerUser.surname);
      expect(user.surname).toBe('TestB');
      expect(user.user_id).toEqual(formerUser.user_id)
      expect(user.first_name).toEqual(formerUser.first_name);
      expect(user.email).toEqual(formerUser.email)
      expect(user.phone).toEqual(formerUser.phone_number)
      expect(user.avatar).toEqual(formerUser.avatar)
    });
  });

  describe("PATCH /api/users/:id with 2 valid keys", () => {
    test("200 - when patching first_name and avatar only", async () => {
      const formerUser = await request(app).get('/api/users/1').then(({ body: { user } }) => { return user })
      const res = await request(app).patch('/api/users/1').send(
        {
          "first_name": "TestA",
          "avatar": "image-test.jpeg"
        }
      )
      const { body: { user } } = res;
      expect(user.first_name).not.toEqual(formerUser.first_name);
      expect(user.avatar).not.toEqual(formerUser.avatar)
      expect(user.first_name).toBe('TestA');
      expect(user.avatar).toEqual('image-test.jpeg')
      expect(user.user_id).toEqual(formerUser.user_id)
      expect(user.surname).toEqual(formerUser.surname);
      expect(user.email).toEqual(formerUser.email)
      expect(user.phone).toEqual(formerUser.phone_number)
    });
  });