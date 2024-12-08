const db = require("../db/connection");
const format = require("pg-format");
const numOfProperties = async () => (await this.fetchProperties()).length
const numOfReviews = async () => (await this.fetchPropertyReviews()).length
const numOfGuest = async () => (await this.fetchGuests()).length


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
        return rows = undefined
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
        return rows = undefined
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
      return rows = undefined;
    } else {
      return rows
    }
  })
};

exports.fetchFavourites = () => {
  return db.query(`SELECT * FROM favourites`)
    .then(({ rows }) => { return rows })
};

exports.createFavourite = (guest_id, id) => {
  if (guest_id === 0 || guest_id > 6) {
    return db
      .query("")
      .then(({ rows }) => { return rows[0] })
  }
  if (!Number(id) > 0 || !Number(guest_id) > 0) {

    throw new Error("Invalid typeof")
  }
  return db
    .query(format(`INSERT INTO favourites(guest_id, property_id) VALUES (%L) RETURNING *`, [guest_id, id]))
    .then(({ rows }) => {
      return rows.length === 0 ? undefined : rows[0]
    })
};

exports.removeFavourite = (id) => {
  if (!Number(id) > 0) {
    throw new Error("Invalid typeof")
  }

  return db
    .query(format(`DELETE FROM favourites WHERE favourite_id = (%L) RETURNING *`, [id]))
    .then(({ rows }) => {

      if (rows.length === 0) {
        return rows = undefined
      } else {
        return rows[0]
      }
    })
};

exports.fetchPropertyById = async (req, res, id) => {
if (Number(id) > await numOfProperties()) {
    return undefined
  }
  if (!Number(id) > 0) {
    return "Bad request."
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
        return undefined
      }
      else {
        return rows[0]
      }
    }
    )
};

exports.fetchPropertyReviews = (id) => {
if(!Number(id) > 0) {
  throw new Error('Invalid typeof id')
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
      if(rows.length === 0) {
        return false
      } else {
              return rows

      }
     })
};

exports.calcAverageRating = async (obj) => {
  let total = 0;
  let average_ratings = 0;

  for (const keys in obj) {
    total += obj[keys].rating;
  }
  average_ratings = total / obj.length
  return average_ratings;
};

exports.fetchGuests = () => {
  return db.query(`SELECT user_id FROM users`).then(({rows}) => {return rows})
}


exports.createReview = async (id, guest_id, rating, comment) => {
if(id === 0 || id > await numOfProperties() || guest_id > await numOfGuest()) {
  return undefined
}
if(!Number(id) > 0 || !Number(guest_id) || !Number(rating)) {
  return 'Bad request.'
};

  return db.query(format(`INSERT INTO reviews( property_id,
                                        guest_id,
                                        rating,
                                        comment) VALUES (%L) RETURNING *`, [id, guest_id, rating, comment]))
            .then(({rows}) => { 
              return rows[0] 
            })
};

exports.removeReview = (id) => {
  if(!Number(id) > 0) {
    throw new Error('Invalid typeof id.')
  }
  return db.query(`DELETE FROM reviews WHERE review_id = $1 RETURNING *`, [id])
  .then(({rows}) => { return rows[0]})
};

