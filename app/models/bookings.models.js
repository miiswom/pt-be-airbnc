const db = require("../../db/connection");
const { updateBookingByIdQuery } = require("./queries/queryStr")
exports.removeBooking = (id) => {
  return db.query(`DELETE FROM bookings WHERE booking_id = $1 RETURNING *;`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404 })
      } else {
        return rows
      }
    })
};

exports.updateBooking = (id, check_in_date,  check_out_date) => {
  const {updateBookingById} = updateBookingByIdQuery()
  return db.query(updateBookingById, [check_in_date, check_out_date, id])
            .then(({rows}) => { 

              console.log(rows[0])
               })
}