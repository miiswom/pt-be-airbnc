const db = require("../../db/connection");
const { createUserQuery } = require("./queries/queryStr")
exports.createUser = (newUser) => {
  const { createUser } = createUserQuery()
  
  return db.query(createUser, [...newUser]).then(({rows}) => {
    if(rows.length === 0) {
      return Promise.reject({status: 404})
    } else {
      return rows
    }
  })
}
