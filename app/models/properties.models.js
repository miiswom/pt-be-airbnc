const db = require("../../db/connection");
const { selectPropertiesQuery, selectPropertyByIdQuery, selectReviewsByIdQuery,} = require("./queries/queryStr")

// properties 
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