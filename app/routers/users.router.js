const express = require("express");
const { getUserById, patchUser, getUsersBookings} = require("../controllers/users.controllers");
const { handleMethodNotAllowed } = require("../controllers/errors/handlingErrors")
const { verifyToken} = require("./utils/verifyAuth")
const usersRouter = express.Router()

// users router //
usersRouter
.route('/:id')
.get(verifyToken, getUserById)
.patch(patchUser)
.all(handleMethodNotAllowed);

usersRouter
.route("/:id/bookings")
.get(getUsersBookings)
.all(handleMethodNotAllowed)

module.exports = usersRouter;