const db = require("../../db/connection");
const { selectUserByIdQuery, patchUserByIdQuery, selectUsersBookingByIdQuery, createUserQuery , selectUserReviewsQuery, selectUserPropertiesQuery} = require("./queries/queryStr")


// users

exports.fetchUserById = async (id) => {
  const { selectUserById } = selectUserByIdQuery()

  console.log( selectUserById)
  return db.query(selectUserById, [id]).then(({ rows }) => {
    console.log(rows)
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
};

exports.fetchUsersBooking = (id) => {
  const { selectUsersBookingById } = selectUsersBookingByIdQuery()
  return db.query(selectUsersBookingById, [id]).then(({rows}) => { 
    if(rows.length === 0) {
      return Promise.reject({status: 404})
    } else {
      return rows
    }
     })
};

exports.fetchUserReviews = (id) => {
  const {selectUserReviews} = selectUserReviewsQuery()

  return db.query(selectUserReviews, [id]).then(({rows}) => {
    console.log("rows", rows)
    if(rows.length === 0) {
      return Promise.reject({status: 404})
    } else {
      return rows
    }
  })
};

exports.fetchUserProperties = (id) => {
  const { selectUserProperties} = selectUserPropertiesQuery();

  return db.query(selectUserProperties, [id]).then(({rows}) => {
    if(rows.length === 0) {
      return Promise.reject({status: 404})
    } else {
      return rows;
    }
  })
}