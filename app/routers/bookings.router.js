const express = require("express");
const bookingsRouter = express.Router();
const { deleteBooking, patchBooking } = require("../controllers/bookings.controller");
const { handleMethodNotAllowed } = require("../controllers/errors/handlingErrors");
const { verifyAuth } = require("./utils/verifyAuth");

bookingsRouter
.route("/:id")
.delete( verifyAuth, deleteBooking)
.patch(verifyAuth ,patchBooking)
.all(handleMethodNotAllowed);

module.exports = bookingsRouter;