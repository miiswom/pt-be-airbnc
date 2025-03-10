const { fetchUserById, updateUser, fetchUsersBooking } = require("../models/users.models")


// users 
exports.getUserById = (req, res, next) => {
  const { id } = req.params;
  fetchUserById(id).then((user) => {
    if (!user) {
      next(err)
    }
    res.status(200).json({ user })
  }).catch((err) => {
    next(err)
  })
};

exports.patchUser = (req, res, next) => {
  const { first_name, surname, email, phone, avatar } = req.body
  const { id } = req.params
  updateUser(id, first_name, surname, email, phone, avatar)
    .then((user) => {
      res.status(200).json({ user })
    }).catch((err) => {
      next(err)
    })
};

exports.getUsersBookings = (req, res, next) => {
  const { id } = req.params;
  fetchUsersBooking(id).then((bookings) => {
    //console.log(bookings)

    res.status(200).json({bookings})
  }).catch((err) => {
    next(err)
  })
}