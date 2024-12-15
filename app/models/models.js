const db = require("../../db/connection");
const format = require("pg-format");

exports.fetchProperties = (maxprice, minprice, sort, order, host) => {
  const values = [];
  const queries = [];
  let queriesCount = 0;
  let selectProperties = require("./queryStr");
  let defineOrder = ""

  if (maxprice) {
    values.push(maxprice);
    queriesCount++;
    queries.push(` WHERE price_per_night < $${queriesCount}`)
  };

  if (minprice) {
    values.push(minprice);
    queriesCount++;
    queries.push(` WHERE price_per_night > $${queriesCount}`)
  };

  if (sort === 'popularity' || !sort) {
    queries.push(` ORDER BY favourites.property_id`)
  };

  if (sort !== "popularity") {
    queries.push(` ORDER BY ${sort}`)
  };

  if (order === 'ascending' || !order) {
      defineOrder += ` ASC;`;
    };

  if (order === 'descending') {
      defineOrder += ` DESC;`;
    };

  return db.query(selectProperties + queries.join("") + defineOrder, values).then(({ rows }) => {
    if (rows.length === 0 || !rows) {
      return Promise.reject({ status: 404 });
    } else {
      return rows
    }
  }).catch((err) => {
    return Promise.reject(err)
  })
};

exports.fetchFavourites = () => {
  return db.query(`SELECT * FROM favourites`)
    .then(({ rows }) => {
      return rows
    })
};

exports.createFavourite = async (id, guest_id) => {
  const values = [];

  if (id) {
    values.push(id)
  }
  if (guest_id) {
    values.push(guest_id)
  }
  return db.query(`INSERT INTO favourites(guest_id, property_id) VALUES ($1, $2) RETURNING *`, values)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Sorry, not found.' })
      } else {
        return rows[0]
      }
    }).catch((err) => {
      return Promise.reject(err)
    })
}

exports.removeFavourite = (id) => {
  return db.query(format(`DELETE FROM favourites WHERE favourite_id = (%L) RETURNING *`, [id]))
    .then(({ rows }) => {

      if (rows.length === 0) {
        return Promise.reject({ status: 404 })
      } else {
        return rows[0]
      }
    }).catch((err) => {
      return Promise.reject(err)
    })
};

exports.fetchPropertyById = async (id) => {
  return db.query(`SELECT properties.property_id, 
                        properties.name AS property_name, 
                        location, 
                        price_per_night, 
                        description, 
                        CONCAT(first_name, ' ', surname) AS host,
                        avatar AS host_avatar,
                        COUNT(favourites.property_id) AS favourite_count,
                        ARRAY(SELECT image_url FROM images WHERE property_id = $1) AS images
                    FROM properties
                      JOIN users
                        ON properties.host_id = users.user_id
                      JOIN favourites
                        ON properties.property_id = favourites.property_id
                      JOIN images
                        ON properties.property_id = images.property_id
                    WHERE properties.property_id = $1
                    GROUP BY properties.property_id, users.first_name, users.surname, users.avatar, image_url`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404 })
      } else {
        return rows[0]
      }
    }
    ).catch((err) => {
      return Promise.reject(err)
    })
};

exports.fetchPropertyReviews = (id) => {
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
        return Promise.reject({ status: 404 })
      } else {
        return rows
      }
    }).catch((err) => {
      return Promise.reject(err)
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
};

exports.createReview = async (id, guest_id, rating, comment) => {
  return db.query(format(`INSERT INTO reviews( property_id,
      guest_id,
      rating,
      comment) VALUES (%L) RETURNING *`, [id, guest_id, rating, comment]))
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404 })
      } else {
        return rows[0]
      }
    }).catch((err) => {
      return Promise.reject(err)
    })
};

exports.removeReview = (id) => {
  if (Number(id) === NaN) {
    return Promise.reject({ status: 400 })
  }
  return db.query(`DELETE FROM reviews WHERE review_id = $1 RETURNING *`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404 })
      } else {
        return rows[0]
      }
    })
};

exports.fetchUserById = async (id) => {
  const values = [];
  if (id) values.push(id)

  return db.query(`SELECT user_id,
                          first_name,
                          surname,
                          email, 
                          phone_number,
                          avatar, 
                          created_at
                      FROM users WHERE user_id = $1 `, values).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404 })
    } else {
      return rows[0]
    }
  }
  )
};

exports.updateUser = (id, first_name, surname, email, phone_number, avatar) => {
  const values = [];
  const updateSets = []
  let valuesCount = 0;
  let queryStr = `UPDATE users SET`;
  if (id) {
    values.push(id);
    valuesCount++
  }
  if (first_name) {
    values.push(first_name);
    valuesCount++;
    updateSets.push(` first_name= $${valuesCount}`);
  };

  if (surname) {
    values.push(surname);
    valuesCount++
    updateSets.push(` surname= $${valuesCount}`);
  };

  if (email) {
    values.push(email);
    valuesCount++
    updateSets.push(` email= $${valuesCount}`);
  };

  if (phone_number) {
    values.push(phone_number);
    valuesCount++
    updateSets.push(` phone_number= $${valuesCount}`);
  };

  if (avatar) {
    values.push(avatar);
    valuesCount++
    updateSets.push(`avatar= $${valuesCount}`);
  };

  return db.query(queryStr + updateSets.join(",") + ` WHERE user_id= $1 RETURNING user_id, first_name, surname, email, phone_number AS phone, avatar, created_at;`, values)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404 })
      } else {
        return rows[0]
      }
    }
    ).catch((err) => {
      return Promise.reject(err)
    })
}