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

describe("INVALID METHODS /api/users/:id", () => {
  test("405 - responds with an object containing a message 'Sorry, method not allowed'", async () => {
    const methods = ['delete', 'put', 'post']
    for (const method of methods) {
      const res = await request(app)[method]('/api/users/1').send(
        {
          "first_name": "TestA",
          "surname": "TestB",
          "email": "testC@example.com",
          "phone": "06123456789",
          "avatar": "www.testd.com"
        })
      const { body: { msg } } = res;
      expect(res.status).toBe(405);
      expect(msg).toBe('Sorry, method not allowed.')
    }
  })
});

  describe("PATCH /api/users/:id with 1 valid key", () => {
    test("200 - when patching first_name only", async () => {
      const formerUser = await request(app).get('/api/users/1').then(({ body: { user } }) => { return user })
      const res = await request(app).patch('/api/users/1').send(
        {
          "first_name": "TestA"
        }
      )
      const { body: { user } } = res;
      expect(user.first_name).not.toEqual(formerUser.first_name);
      expect(user.first_name).toBe('TestA');
      expect(user.user_id).toEqual(formerUser.user_id)
      expect(user.surname).toEqual(formerUser.surname);
      expect(user.email).toEqual(formerUser.email)
      expect(user.phone).toEqual(formerUser.phone_number)
      expect(user.avatar).toEqual(formerUser.avatar)
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

  describe("PATCH /api/users/:id with 3 valid keys", () => {
    test("200 - when patching email, surname and phone only", async () => {
      const formerUser = await request(app).get('/api/users/1').then(({ body: { user } }) => { return user })
      const res = await request(app).patch('/api/users/1').send(
        {
          "surname": "surnameTest",
          "email": "testing@example.com",
          "phone": "06123456789"
        }
      )
      const { body: { user } } = res;
      expect(user.surname).not.toBe(formerUser.first_name);
      expect(user.email).not.toBe(formerUser.avatar);
      expect(user.phone).not.toBe(formerUser.phone_number);

      expect(user.surname).toBe('surnameTest');
      expect(user.email).toBe('testing@example.com')
      expect(user.phone).toBe('06123456789');

      expect(user.user_id).toBe(formerUser.user_id)
      expect(user.first_name).toBe(formerUser.first_name);
      expect(user.avatar).toBe(formerUser.avatar)
    });
  });

  describe("PATCH /api/users/:id with 4 valid keys", () => {
    test("200 - when patching avatar, email, surname and phone only", async () => {
      const formerUser = await request(app).get('/api/users/1').then(({ body: { user } }) => { return user })
      const res = await request(app).patch('/api/users/1').send(
        {
          "avatar": "avatar-test.jpg",
          "surname": "surnameTest",
          "email": "testing@example.com",
          "phone": "06123456789"
        }
      )
      const { body: { user } } = res;
      expect(user.surname).not.toBe(formerUser.first_name);
      expect(user.email).not.toBe(formerUser.avatar);
      expect(user.phone).not.toBe(formerUser.phone_number);
      expect(user.avatar).not.toBe(formerUser.avatar)

      expect(user.surname).toBe('surnameTest');
      expect(user.email).toBe('testing@example.com')
      expect(user.phone).toBe('06123456789');
      expect(user.avatar).toBe('avatar-test.jpg')

      expect(user.user_id).toBe(formerUser.user_id)
      expect(user.first_name).toBe(formerUser.first_name);
    });
  });

  describe("PATCH /api/users/:id with 5 valid keys", () => {
    test("200 - responds with an updated user object containing all properties", async () => {
      const res = await request(app).patch('/api/users/1').send(
        {
          "first_name": "TestA",
          "surname": "TestB",
          "email": "testC@example.com",
          "phone": "06123456789",
          "avatar": "avatar-test.jpg"
        }
      )
      const { body: { user } } = res;

      expect(res.status).toBe(200)
      expect(user).toContainAllKeys(['user_id', 'first_name', 'surname', 'email', 'phone', 'avatar', 'created_at'])
    })
    test("200 - when patching 'first_name', 'surname', 'email', 'phone' and 'avatar' responds with updated user object", async () => {
      const res = await request(app).patch('/api/users/1').send(
        {
          "first_name": "TestA",
          "surname": "TestB",
          "email": "testC@example.com",
          "phone": "06123456789",
          "avatar": "avatar-test.jpg"
        }
      )
      const { body: { user } } = res;
      expect(user.first_name).toBe('TestA');
      expect(user.surname).toBe('TestB')
      expect(user.email).toBe('testC@example.com')
      expect(user.phone).toBe('06123456789')
      expect(user.avatar).toBe('avatar-test.jpg')
    });
  });

  //////////////////////////////////

  describe("PATCH /api/users/:unavailable_id", () => {
    test("404 - responds with an object containing a message 'Sorry, not found.'", async () => {
      const res = await request(app).patch('/api/users/23').send(
        {
          "first_name": "TestA",
          "surname": "TestB",
          "email": "testC@example.com",
          "phone": "06123456789",
          "avatar": "avatar-test.jpg"
        })
      const { body: { msg } } = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, not found.')
    })
  })

  describe("PATCH /api/users/:invalid_id", () => {
    test("400 - responds with an object containing a message 'Sorry, bad request'", async () => {
      const res = await request(app).patch('/api/users/abcddk').send(
        {
          "first_name": "TestA",
          "surname": "TestB",
          "email": "testC@example.com",
          "phone": "06123456789",
          "avatar": "www.testd.com"
        })
      const { body: { msg } } = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    })
  }); 

  describe("PATCH /api/user/:id [invalid endpoint]", () => {
    test("400 - responds with an object containing a message 'Sorry, invalid endpoint.", async () => {
      const res = await request(app).patch('/api/user/1').send({
        "first_name": "TestA",
        "surname": "TestB",
        "email": "testC@example.com",
        "phone": "06123456789",
        "avatar": "avatar-test.jpg"
      })
      const { body: { msg } } = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, invalid endpoint.')
    })
  });

  describe("PATCH /api/users/:id [invalid typeof keys]", () => {
    describe("400 - responds with an object containing a message 'Sorry, bad request.", () => {
      test("400 - INVALID first_name ", async () => {
        const res = await request(app).patch('/api/users/1').send({
          "first_name": "06123456789"
        })
        const { body: { msg } } = res;
        expect(res.status).toBe(400)
        expect(msg).toBe('Sorry, bad request.')
      })

      test("400 - INVALID surname", async () => {
        const res = await request(app).patch('/api/users/1').send({
          "surname": "06123456789"
        })
        const { body: { msg } } = res;
        expect(res.status).toBe(400)
        expect(msg).toBe('Sorry, bad request.')
      })

      test("400 - INVALID email.", async () => {
        const res = await request(app).patch('/api/users/1').send({
          "email": "tes.com"
        })
        const { body: { msg } } = res;
        expect(res.status).toBe(400)
        expect(msg).toBe('Sorry, bad request.')
      })

      test("400 - INVALID phone.", async () => {
        const res = await request(app).patch('/api/users/1').send({
          "first_name": "Oakley",
          "phone": "Barbara"
        })
        const { body: { msg } } = res;
        expect(res.status).toBe(400)
        expect(msg).toBe('Sorry, bad request.')
      })

      test("400 - INVALID avatar", async () => {
        const res = await request(app).patch('/api/users/1').send({
          "first_name": "Oakley",
          "phone": "01123456789",
          "avatar": "random"
        })
        const { body: { msg } } = res;
        expect(res.status).toBe(400)
        expect(msg).toBe('Sorry, bad request.')
      })
    })
  });