const db = require("../../db/connection");

exports.removeBooking = (id) => {
  return db.query(`DELETE FROM bookings WHERE booking_id = $1 RETURNING *;`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404 })
      } else {
        return rows
      }
    })
}