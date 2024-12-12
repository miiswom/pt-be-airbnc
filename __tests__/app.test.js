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
      expect(properties).toBeSortedBy('property_id')
    });

    test("405 - respond with an error message 'Sorry, method not allowed.'", async () => {
      const methods = ['delete', 'put', 'patch']
      for (const method of methods) {
        const res = await request(app)[method]('/api/properties')
        const { body: { msg }} = res;
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
  })
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
  })
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
    test("200 - respond with a property object", async () => {
      const res = await request(app).get('/api/properties/1');
      const { body } = res;
      expect(res.status).toBe(200)
      expect(body).toBeObject()
    });

    test("200 - property objects should contains keys of 'property_id', 'property_name', 'location', 'price_per_night', 'description', 'host', 'host_avatar' and 'favourite_count'", async () => {
      const res = await request(app).get('/api/properties/1');
      const { body: { property } } = res;
      for (const keys in property) {
        expect(property).toContainAllKeys(['property_id', 'property_name', 'location', 'price_per_night', 'description', 'host', 'host_avatar', 'favourite_count'])
      }
    });
  })
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
        const { body: { msg }} = res;
        expect(res.status).toBe(405);
        expect(msg).toBe('Sorry, method not allowed.')
      }
    });
  });
});

describe("GET PROPERTY REVIEWS", () => {
  describe("GET /api/properties/:id/reviews", () => {
    test("200 - responds with a json which contains a property of 'reviews' containing an array of reviews objects", async () => {
      const res = await request(app).get('/api/properties/1/reviews')
      const { body: { reviews } } = res;
      expect(reviews).toBeArray()
    });

    test("200 - each reviews object should contains properties of 'review_id', 'comment', 'rating', 'created_at', 'guest' and 'guest_avatar'", async () => {
      const res = await request(app).get('/api/properties/1/reviews')
      const { body: { reviews } } = res;
      reviews.forEach((review) => {
        expect(review).toContainAllKeys(['review_id', 'comment', 'rating', 'created_at', 'guest', 'guest_avatar'])
      })
    });

    test("200 - responds with a json which contains a property of 'average_ratings'", async () => {
      const res = await request(app).get('/api/properties/1/reviews')
      const { body } = res;
      expect(body).toContainKey('average_rating')
    })
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
        const { body: { msg }} = res;
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
      const { body: { msg}} =res;
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
      const { body: { msg}} =res;
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
      const {body : {msg}} = res;
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
      const {body : {msg}} = res;
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
      const {body : {msg}} = res;
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
      const {body : {msg}} = res;
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
      const {body: {msg}} = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, not found.')
    })
  })

  describe("DELETE /api/reviews/:invalid_id", () => {
    test("400 - responds with a json containing an error message 'Sorry, bad request'", async () => {
      const res = await request(app).delete('/api/reviews/sdds')
      const {body: {msg}} = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    })
  });

  describe("INVALID METHODS /api/reviews/:id", () => {
    test("405 - responds with a json containing an error message 'Sorry, method not allowed'", async () => {
      const methods = ['get', 'put', 'post', 'patch']
      for (const method of methods) {
        const res = await request(app)[method]('/api/reviews/1')
        const { body: { msg }} = res;
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
      const { body: { user}} = res;
      expect(res.status).toBe(200)
      expect(user).toContainAllKeys(['user_id', 'first_name', 'surname', 'email', 'phone_number', 'avatar', 'created_at'])
    })
  });

  describe("GET /api/users/:unavailable_id", () => {
    test("404 - responds with a json containing a message 'Sorry, not found'", async () => {
      const res = await request(app).get('/api/users/1000')
      const { body: { msg }} = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, not found.')
    })
  });

  describe("GET /api/users/:invalid_id", () => {
    test("400 - responds with a json containing a message 'Sorry, bad request'", async () => {
      const res = await request(app).get('/api/users/banana')
      const { body: { msg }} = res;
      expect(res.status).toBe(400)
      expect(msg).toBe('Sorry, bad request.')
    })
  });

  describe("GET /api/users/:invalid/endpoint", () => {
    test("404 - responds with a json containing a message 'Sorry, not found'", async () => {
      const res = await request(app).get('/api/usersss/1')
      const { body: { msg }} = res;
      expect(res.status).toBe(404)
      expect(msg).toBe('Sorry, invalid endpoint.')
    })
  });

  describe("INVALID METHODS /api/users/:id", () => {
    test("405 - responds with a json containing a message 'Sorry, method not allowed'", async () => {
      const methods = ['delete', 'put', 'post']
      for (const method of methods) {
        const res = await request(app)[method]('/api/users/1')
        const { body: { msg }} = res;
        expect(res.status).toBe(405);
        expect(msg).toBe('Sorry, method not allowed.')
      }
    })
  })
})