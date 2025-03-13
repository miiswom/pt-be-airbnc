const db = require("../../db/connection");
const { insertReviewQuery} = require("./queries/queryStr")

// reviews 

exports.createReview = async (id, guest_id, rating, comment) => {
  const { insertReview } = insertReviewQuery(id, guest_id, rating, comment)
  
  return db.query(insertReview, [id, guest_id, rating, comment])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404 })
      } else {
        console.log("rows[0]", rows[0])
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