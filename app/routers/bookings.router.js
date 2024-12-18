const express = require("express");
const { deleteBooking, patchBooking } = require("../controllers/bookings.controller");
const { handleMethodNotAllowed } = require("../controllers/errors/handlingErrors");
const bookingsRouter = express.Router();

bookingsRouter
.route("/:id")
.delete(deleteBooking)
.patch(patchBooking)
.all(handleMethodNotAllowed);

module.exports = bookingsRouter;