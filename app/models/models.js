const db = require("../../db/connection");
const format = require("pg-format");
const { selectPropertiesQuery, insertFavouritesQuery, selectPropertyByIdQuery, selectReviewsByIdQuery, insertReviewQuery, selectUserByIdQuery, patchUserByIdQuery } = require("./queryStr")


exports.fetchProperties = async (maxprice, minprice, sort, order, host) => {
  const {selectProperties, defineOrder, values} = selectPropertiesQuery(maxprice, minprice, sort, order, host);

  return db.query(selectProperties + defineOrder, values).then(({ rows }) => {
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
  const {insertFavourites, values} = insertFavouritesQuery(id, guest_id)
  
  return db.query(insertFavourites, values)
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
  const { selectPropertyById } = selectPropertyByIdQuery();
  
  return db.query(selectPropertyById, [id])
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

// Refactor in progres here...

exports.fetchPropertyReviews = (id) => {
  const { selectReviewsById } = selectReviewsByIdQuery()
  
  return db.query(selectReviewsById, [id])
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
  average_rating = total / obj.length
  return average_rating;
};

exports.fetchGuests = () => {
  return db.query(`SELECT user_id FROM users`).then(({ rows }) => { return rows })
};

exports.createReview = async (id, guest_id, rating, comment) => {
  const { insertReview } = insertReviewQuery(id, guest_id, rating, comment)
  
  return db.query(insertReview, [id, guest_id, rating, comment])
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
  const { selectUserById } = selectUserByIdQuery()
  
  return db.query(selectUserById, [id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404 })
    } else {
      return rows[0]
    }
  }
  )
};

exports.updateUser = (id, first_name, surname, email, phone_number, avatar) => {

  const { updateUserById, values } = patchUserByIdQuery(id, first_name, surname, email, phone_number, avatar)

  return db.query(updateUserById, values)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404 })
      } else {
        return rows[0]
      }
    }).catch((err) => {
      return Promise.reject(err)
    })
}