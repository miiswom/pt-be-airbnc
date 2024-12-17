const { removeBooking } = require("../models/bookings.models")

exports.deleteBooking = (req, res, next) => {
  const {id} = req.params;
  removeBooking(id).then(() => {
    res.status(204).json({})
  }).catch((err) => {
    next(err)
  })
}