const request = require("supertest");
const app = require("../app/app");
const db = require("../db/connection")
const { seed } = require("../db/seed");
const data = require("../db/data/test");
//const { fetchFavourites } = require("../app/models")
//const numOfFavourites = async () => (await fetchFavourites()).length

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
        expect(property).toContainAllKeys(['property_id', 'property_name', 'location', 'price_per_night', 'host', 'image'])
      })
    });

    test("200 - array of properties should be sorted by popularity in descending order", async () => {
      const res = await request(app).get('/api/properties');
      const { body: { properties } } = res;
      expect(properties).toBeSortedBy('property_id')
    });

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
    test("201 - responds with an object containing a successful message and the new favourite_id number", async () => {
      const res = await request(app).post('/api/properties/1/favourite').send({ "guest_id": "1" });
      const { body: { msg } } = res;
      expect(res.status).toBe(201)
      expect(msg).toBe('Property favourited successfully.');
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

  describe("POST /api/properties/:invalid_typeofid/favourite", () => {
    test("400 - responds with an object containing a 'Sorry, bad request' error message ", async () => {
      const res = await request(app).post('/api/properties/char/favourite').send({ "guest_id": "1" });
      const { body: { msg } } = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    })
  });

  describe("POST /api/properties/:id/favourite  [invalid typeof guest_id]", () => {
    test("400 - responds with an object containing a 'Sorry, bad request' error message ", async () => {
      const res = await request(app).post('/api/properties/char/favourite').send({ "guest_id": "\safwff" });
      const { body: { msg } } = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    })
  })
});

describe("DELETE FAVOURITE", () => {
  describe("DELETE /api/favourite/:id", () => {
    test("204 - responds with a status code of 204 and an empty body", async () => {
      const res = await request(app).delete('/api/favourite/10');
      expect(res.status).toBe(204)
    })
  });

  describe("DELETE /api/favourite/:invalid_id", () => {
    test("404 - responds with a 'Sorry, not found' error message", async () => {
      const res = await request(app).delete('/api/favourite/999999');
      const { body: { msg } } = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, not found.')
    })
  });

  describe("DELETE /api/favourite/:unavailable_id [already deleted]", () => {
    test("404 - responds with a 'Sorry, not found' error message", async () => {
      const resOne = await request(app).delete('/api/favourite/1');
      expect(resOne.status).toBe(204)

      const resTwo = await request(app).delete('/api/favourite/1');
      const { body: { msg } } = resTwo;
      expect(resTwo.status).toBe(404)
      expect(msg).toBe('Sorry, not found.')
    })
  });

  describe("DELETE /api/favourite/:invalid_typeofid", () => {
    test("400 - responds with a 'Sorry, bad request' error message", async () => {
      const res = await request(app).delete('/api/favourite/sdfafd');
      const { body: { msg } } = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    })
  });

  describe("DELETE /api/:invalid_endpoint", () => {
    test("400 - responds with a 'Sorry, bad request' error message", async () => {
      const res = await request(app).delete('/api/fdfafd/10');
      const { body: { msg } } = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, invalid endpoint.')
    })
  })
});

describe("GET PROPERTY", () => {
  describe("GET /api/properties/:id", () => {
    test("200 - property objects should contains keys of 'property_id', 'property_name', 'location', 'price_per_night', 'description', 'host', 'host_avatar' and 'favourite_count'", async () => {
      const res = await request(app).get('/api/properties/1');
      const { body: { property } } = res;
      expect(res.status).toBe(200)
      expect(property).toContainAllKeys(['property_id', 'property_name', 'location', 'price_per_night', 'description', 'host', 'host_avatar', 'favourite_count', 'images'])
    });
  });
  
  describe("GET /api/properties/:unavailable_id", () => {
    test("404 - respond with an error message 'Sorry, not found.'", async () => {
      const res = await request(app).get('/api/properties/555555555551');
      const { body: { msg } } = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, not found.')
    });
  });

  describe("GET /api/properties/:invalid_id", () => {
    test("400 - respond with an error message 'Sorry, bad request.'", async () => {
      const res = await request(app).get('/api/properties/bftyfgu');
      const { body: { msg } } = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    });
  });

  describe("DELETE /api/properties/:id", () => {
    test("405 - respond with an error message 'Sorry, method not allowed.'", async () => {
      const methods = ['delete', 'put', 'patch',]
      for (const method of methods) {
        const res = await request(app)[method]('/api/properties/1')
        const { body: { msg } } = res;
        expect(res.status).toBe(405);
        expect(msg).toBe('Sorry, method not allowed.')
      }
    });
  });
});

describe("GET PROPERTY REVIEWS", () => {
  describe("GET /api/properties/:id/reviews", () => {
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
  });

  describe("GET /api/properties/:unavailable_id/reviews", () => {
    test("404 - responds with a 'Sorry, not found' error message", async () => {
      const res = await request(app).get('/api/properties/2000/reviews');
      const { body: { msg } } = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, not found.')
    })
  });

  describe("GET /api/properties/:invalid_id/reviews", () => {
    test("400 - responds with a 'Sorry, bad request' error message", async () => {
      const res = await request(app).get('/api/properties/ksdjfndsk/reviews');
      const { body: { msg } } = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    })
  })

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
  })
})

describe("POST PROPERTY REVIEWS", () => {
  describe("POST /api/properties/:id/reviews", () => {
    test("201 - responds with an object containing properties of 'review_id', 'property_id', 'guest_id', 'rating', 'comment' and 'created_at'", async () => {
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
  });

  describe("POST /api/properties/:unavailable_id/reviews", () => {
    test("404 - responds with an object containing an error message 'Sorry, not found.'", async () => {
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
  });

  describe("POST /api/properties/:invalid_id/reviews", () => {
    test("400 - responds with an object containing an error message 'Sorry, bad request.'", async () => {
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
  });

  describe("POST /api/properties/:id [unavailable guest_id ]", () => {
    test("404 - responds with a json containing an error message 'Sorry, not found.'", async () => {
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

  describe("POST /api/properties/:id [invalid <guest_id | rating>]", () => {
    test("400 - an invalid guest_id sends back json containing an error message 'Sorry, bad request'", async () => {
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

    test("400 - an invalid rating sends back json containing an error message 'Sorry, bad request'", async () => {
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
  })

  describe("POST /api/properties/:id [unvailable guest_id]", () => {
    test("404 - responds with a json containing an error message 'Sorry, not found'", async () => {
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
  })
});

// add test to limit rating number to 5 max

describe("DELETE PROPERTY REVIEW", () => {
  describe("DELETE /api/reviews/:id", () => {
    test("204 - responds with a status code 204", async () => {
      const res = await request(app).delete('/api/reviews/1')
      expect(res.status).toBe(204)
    })
  })

  describe("DELETE /api/reviews/:unavailable_id", () => {
    test("404 - responds with a json containing an error message 'Sorry, not found.'", async () => {
      const res = await request(app).delete('/api/reviews/10000')
      const { body: { msg } } = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, not found.')
    })
  })

  describe("DELETE /api/reviews/:invalid_id", () => {
    test("400 - responds with a json containing an error message 'Sorry, bad request'", async () => {
      const res = await request(app).delete('/api/reviews/sdds')
      const { body: { msg } } = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    })
  });

  describe("INVALID METHODS /api/reviews/:id", () => {
    test("405 - responds with a json containing an error message 'Sorry, method not allowed'", async () => {
      const methods = ['get', 'put', 'post', 'patch']
      for (const method of methods) {
        const res = await request(app)[method]('/api/reviews/1')
        const { body: { msg } } = res;
        expect(res.status).toBe(405);
        expect(msg).toBe('Sorry, method not allowed.')
      }
    })
  })
});

describe("GET USER", () => {
  describe("GET /api/users/:id", () => {
    test("200 - responds with an object containing the keys of 'user_id', 'first_name', 'surname', 'email', 'phone_number', 'avatar' and 'created_at'", async () => {
      const res = await request(app).get('/api/users/1')
      const { body: { user } } = res;
      expect(res.status).toBe(200)
      expect(user).toContainAllKeys(['user_id', 'first_name', 'surname', 'email', 'phone_number', 'avatar', 'created_at'])
    })
  });

  describe("GET /api/users/:unavailable_id", () => {
    test("404 - responds with a json containing a message 'Sorry, not found'", async () => {
      const res = await request(app).get('/api/users/1000')
      const { body: { msg } } = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, not found.')
    })
  });

  // add test for ridiculously high num

  describe("GET /api/users/:invalid_id", () => {
    test("400 - responds with a json containing a message 'Sorry, bad request'", async () => {
      const res = await request(app).get('/api/users/banana')
      const { body: { msg } } = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    })
  });

  describe("GET /api/users/:invalid/endpoint", () => {
    test("404 - responds with a json containing a message 'Sorry, not found'", async () => {
      const res = await request(app).get('/api/usersss/1')
      const { body: { msg } } = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, invalid endpoint.')
    })
  });

  describe("INVALID METHODS /api/users/:id", () => {
    test("405 - responds with a json containing a message 'Sorry, method not allowed'", async () => {
      const methods = ['delete', 'put', 'post']
      for (const method of methods) {
        const res = await request(app)[method]('/api/users/1')
        const { body: { msg } } = res;
        expect(res.status).toBe(405);
        expect(msg).toBe('Sorry, method not allowed.')
      }
    })
  })
});

describe("PATCH USER", () => {
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

  describe("PATCH /api/users/:id [invalid keys]", () => {
    describe("400 - Invalid typeof character passed responds with an object containing a message 'Sorry, bad request.", () => {
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
});