const express = require("express");
const { deleteBooking } = require("../controllers/bookings.controller");
const { handleMethodNotAllowed } = require("../controllers/errors/handlingErrors");
const bookingsRouter = express.Router();

bookingsRouter
.route("/:id")
.delete(deleteBooking)
.all(handleMethodNotAllowed);

module.exports = bookingsRouter;