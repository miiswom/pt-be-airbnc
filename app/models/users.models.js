const db = require("../../db/connection");
const { selectUserByIdQuery, patchUserByIdQuery } = require("./queries/queryStr")


// users

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