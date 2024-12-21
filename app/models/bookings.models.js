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

exports.updateBooking = (id, check_in_date, check_out_date) => {
  const { updateBookingById } = updateBookingByIdQuery()
  return db.query(updateBookingById, [check_in_date, check_out_date, id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({status: 404})
      } else {
        return {
          booking_id: rows[0].booking_id,
          property_id: rows[0].property_id,
          guest_id: rows[0].property_id,
          check_in_date: JSON.stringify(rows[0].check_in_date).slice(1, 11),
          check_out_date: JSON.stringify(rows[0].check_out_date).slice(1, 11),
          created_at: rows[0].created_at
        }
      }
    })
}

// [booking.check_in_date][0].slice(0, 10)