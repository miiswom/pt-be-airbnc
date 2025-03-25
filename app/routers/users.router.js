const express = require("express");
const { getUserById, patchUser, getUsersBookings, getUserReviews, getUserProperties} = require("../controllers/users.controllers");
const { handleMethodNotAllowed } = require("../controllers/errors/handlingErrors")
const { verifyAuth} = require("./utils/verifyAuth")
const usersRouter = express.Router()

// users router //
usersRouter
.route('/:id')
.get(verifyAuth, getUserById)
.patch(patchUser)
.all(handleMethodNotAllowed);

usersRouter
.route("/:id/bookings")
.get(getUsersBookings)
.all(handleMethodNotAllowed)

usersRouter
.route("/:id/reviews")
.get(getUserReviews)
.all(handleMethodNotAllowed)

usersRouter
.route("/:id/properties")
.get(getUserProperties)
.all(handleMethodNotAllowed)

module.exports = usersRouter;