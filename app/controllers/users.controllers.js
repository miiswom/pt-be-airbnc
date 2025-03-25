const { fetchUserById, updateUser, fetchUsersBooking, fetchUserReviews, fetchUserProperties } = require("../models/users.models")


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
};

exports.getUserReviews = (req, res, next) => {
  const { id } = req.params;

  fetchUserReviews(id).then((reviews) => {
    console.log("reviews", reviews)
    res.status(200).json({reviews})
  
  }).catch((err) => {
    next(err)
  })
};

exports.getUserProperties = (req, res, next) => {
  const { id } = req.params;

  fetchUserProperties(id).then((properties) => {
   res.status(200).json({properties})
  })
  .catch((err) => {
    next(err)
  })
}