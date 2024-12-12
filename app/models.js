const db = require("../db/connection");
const format = require("pg-format");
const numOfProperties = async () => (await this.validPropertyIds()).length
const numOfReviews = async () => (await this.fetchPropertyReviews()).length
const numOfGuest = async () => (await this.fetchGuests()).length;

const validPropertyIds = async () => {
  return db.query(`SELECT property_id FROM properties`)
    .then(({ rows }) => {
      const ids = []
      rows.forEach((row) => {
        ids.push(row.property_id)
      })
      return ids
    }).catch((err) => { console.log(err) })
};

const validUsersIds = async () => {
  return db.query(`SELECT user_id FROM users`)
    .then(({ rows }) => {
      const ids = []
      rows.forEach((row) => {
        ids.push(row.user_id)
      })
      return ids
    }).catch((err) => { console.log(err) })
};

exports.fetchProperties = (maxprice, minprice, sort, order, host) => {
  let queryStr = `SELECT  favourites.property_id,
                          properties.name AS property_name,
                          location,
                          price_per_night,
                          CONCAT(first_name, ' ', surname) AS host
                    FROM properties
                    JOIN users
                    ON properties.host_id = users.user_id
                    JOIN favourites
                    ON properties.property_id = favourites.property_id`;
  const defaultSort = ` ORDER BY favourites.property_id`;
  const defaultOrder = ` ASC`;
  const validSortKeys = ['property_id', 'property_name', 'location', 'price_per_night', 'host'];
  let defineOrder = ""

  if (maxprice) {
    queryStr += format(` WHERE price_per_night < (%L)`, [maxprice])
  }
  if (minprice) {
    queryStr += format(` WHERE price_per_night > (%L)`, [minprice])
  }
  if (sort) {
    if (sort && validSortKeys.includes(sort)) {
      queryStr += ` ORDER BY ${sort}`
    } else if (sort === 'popularity') {
      queryStr += defaultSort
    } else {
      queryStr = ""
      return db.query(queryStr).then(({ rows }) => {
        return Promise.reject({ status: 404 });
      })
    }
  }

  if (order) {
    if (order === 'ascending') {
      const asc = order.slice(0, 3)
      defineOrder += (" " + asc)
    } else if (order === 'descending') {
      const desc = order.slice(0, 4)
      defineOrder += (" " + desc)
    } else {
      queryStr = ""
      return db.query(queryStr).then(({ rows }) => {
        return Promise.reject({ status: 404 });
      })
    }
  }
  if (!sort) {
    queryStr += defaultSort
  }
  if (!order) {
    queryStr += defaultOrder
  }
  return db.query(queryStr + defineOrder).then(({ rows }) => {
    if (rows.length === 0 || !rows) {
      return Promise.reject({ status: 404 });
    } else {
      return rows
    }
  })
};

exports.fetchFavourites = () => {
  return db.query(`SELECT * FROM favourites`)
    .then(({ rows }) => { return rows })
};

exports.createFavourite = async (guest_id, id) => {
  if (Number(id) === NaN || Number(guest_id) === NaN) {
    return Promise.reject({ status: 400, msg: 'Sorry, bad request.' })
  }
  if (guest_id === 0 || guest_id > 6) {
    console.log("1")

    return Promise.reject({ status: 404, msg: 'Sorry, not found.' })
  }
  return db
    .query(format(`INSERT INTO favourites(guest_id, property_id) VALUES (%L) RETURNING *`, [guest_id, id]))
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Sorry, not found.' })

      } else {
        return rows[0]
      }
    })
};

exports.removeFavourite = (id) => {
  if (Number(id) === NaN) {
    return Promise.reject({ status: 400 })
  }

  return db
    .query(format(`DELETE FROM favourites WHERE favourite_id = (%L) RETURNING *`, [id]))
    .then(({ rows }) => {

      if (rows.length === 0) {
        return Promise.reject({ status: 404 })
      } else {
        return rows[0]
      }
    })
};

exports.fetchPropertyById = async (id) => {
  if (Number(id) > await validPropertyIds()) {
    console.log("1")
    return Promise.reject({ status: 404 })
  }
  if (!Number(id) > 0) {
    return Promise.reject({ status: 400 })
  }
  return db
    .query(format(`SELECT properties.property_id, 
                        properties.name AS property_name, 
                        location, 
                        price_per_night, 
                        description, 
                        CONCAT(first_name, ' ', surname) AS host,
                        avatar AS host_avatar,
                        COUNT(favourites.property_id) AS favourite_count
                    FROM properties
                      JOIN users
                        ON properties.host_id = users.user_id
                      JOIN favourites
                        ON properties.property_id = favourites.property_id
                    WHERE properties.property_id = (%L)
                    GROUP BY properties.property_id, users.first_name, users.surname, users.avatar`, [id]))
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404 })
      }
      else {
        return rows[0]
      }
    }
    )
};

exports.fetchPropertyReviews = (id) => {
  if (Number(id) === NaN) {
    return Promise.reject({ status: 400 })
  }
  return db.query(format(`SELECT review_id,
                          comment,
                          rating,
                          reviews.created_at,
                          CONCAT(first_name, ' ', surname) AS guest,
                          avatar AS guest_avatar
                      FROM reviews
                        JOIN users
                          ON reviews.guest_id = users.user_id
                      WHERE review_id = %L`, [id]))
    .then(({ rows }) => {
      if (rows.length === 0) {
        console.log("1")
        return Promise.reject({ status: 404 })
      } else {
        return rows
      }
    })
};

exports.calcAverageRating = async (obj) => {
  let total = 0;
  let average_rating = 0;

  for (const keys in obj) {
    total += obj[keys].rating;
  }
  average_ratings = total / obj.length
  return average_rating;
};

exports.fetchGuests = () => {
  return db.query(`SELECT user_id FROM users`).then(({ rows }) => { return rows })
}


exports.createReview = async (id, guest_id, rating, comment) => {

  if (Number(id) === NaN || Number(guest_id) === NaN || Number(rating) === NaN) {
    return Promise.reject({ status: 400 })
  }
  if (id === 0 || (Number(id) > 0 && !(await validPropertyIds()).includes(Number(id))) || guest_id > await numOfGuest()) {
    return Promise.reject({ status: 404 })
  } 
    return db.query(format(`INSERT INTO reviews( property_id,
      guest_id,
      rating,
      comment) VALUES (%L) RETURNING *`, [id, guest_id, rating, comment]))
      .then(({ rows }) => {
        return rows[0]
      })
};

exports.removeReview = (id) => {
  if (Number(id) === NaN) {
    return Promise.reject({status: 400})
  }
  return db.query(`DELETE FROM reviews WHERE review_id = $1 RETURNING *`, [id])
    .then(({ rows }) => { 
      if(rows.length === 0) {
        return Promise.reject({status: 404})
      } else {
        return rows[0] 
      }
    })
};

exports.fetchUserById = async (id) => {
  const values = [];
  if(id) values.push(id)

  return db.query(`SELECT user_id,
                          first_name,
                          surname,
                          email, 
                          phone_number,
                          avatar, 
                          created_at
                      FROM users WHERE user_id = $1 `, values).then(({rows}) => { 
                        if(rows.length === 0) {
                          return Promise.reject({status: 404})
                        } else {
                          return rows[0]}
                        }
                          )
};

exports.updateUser = (id, first_name, surname, email, phone, avatar) => {
  const values = [];
  // let queryStr = `UPDATE users SET`;
  // let userId = ` WHERE user_id= $1`
  if(id) {
    values.push(id);
  }
  if(first_name) {
    values.push(first_name);
  };

  console.log(values)

  // // if(surname) values.push(surname);
  // // if(email) values.push(email);
  // // if(phone) values.push(phone);
  // // if(avatar) values.push(avatar);
  // console.log(queryStr + userId + ` RETURNING *;`, values, [id])
  return db.query(`UPDATE users SET first_name= $2 WHERE user_id= $1 RETURNING *;`, values)
  .then(({rows}) => { 
    // values.push(rows[0].user_id)
    // return db.query(`UPDATE users SET first_name`)
    return rows[0]
  }
)
}