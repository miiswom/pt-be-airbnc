const { removeBooking, updateBooking } = require("../models/bookings.models")

exports.deleteBooking = (req, res, next) => {
  const {id} = req.params;
  removeBooking(id).then(() => {
    res.status(204).json({})
  }).catch((err) => {
    next(err)
  })
};

exports.patchBooking = (req, res, next) => {
  const {id} = req.params;
  const {check_in_date,  check_out_date } = req.body;
  updateBooking(id, check_in_date,  check_out_date).then((booking) => {
    res.status(200).json({booking})
  }).catch((err) => {
    next(err)
  })
}