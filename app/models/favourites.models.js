const db = require("../../db/connection");
const { insertFavouritesQuery } = require("./queries/queryStr")

// favourites 

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
  return db.query(`DELETE FROM favourites WHERE favourite_id = $1 RETURNING *`, [id])
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