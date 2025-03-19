const db = require("../../db/connection");
const {selectUserByCredentialsQuery} = require("./queries/queryStr")

exports.fetchUserByCredentials = async(email) => {
  const { selectUserByCredentials} = selectUserByCredentialsQuery()
  return db.query(selectUserByCredentials, [email]).then(({rows}) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404 })
    } else {
      return rows[0]
    }
  })
}