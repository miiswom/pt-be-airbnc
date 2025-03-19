const express = require("express");
const bookingsRouter = express.Router();
const { deleteBooking, patchBooking } = require("../controllers/bookings.controller");
const { handleMethodNotAllowed } = require("../controllers/errors/handlingErrors");

bookingsRouter
.route("/:id")
.delete(deleteBooking)
.patch(patchBooking)
.all(handleMethodNotAllowed);

module.exports = bookingsRouter;