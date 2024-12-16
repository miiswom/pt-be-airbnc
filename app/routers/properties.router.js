const express = require("express");
const {getProperties, getPropertyById, getPropertyReview, getBookings } = require("../controllers/properties.controllers");
const { postNewFavourite } = require("../controllers/favourite.controllers");
const { postNewReview } = require("../controllers/reviews.controllers")
const { handleMethodNotAllowed } = require("../controllers/errors/handlingErrors");
const propertiesRouter = express.Router();

// properties router //
propertiesRouter
.route("/")
.get(getProperties);

propertiesRouter
.route("/:id")
.get(getPropertyById)

propertiesRouter
.route("/:id/favourite")
.post(postNewFavourite);

propertiesRouter
.route("/:id/reviews")
.get(getPropertyReview)
.post(postNewReview);

// bookings 
propertiesRouter
.route("/:id/bookings")
.get(getBookings)

propertiesRouter
.route("/?(*)?")
.all(handleMethodNotAllowed);



module.exports = propertiesRouter;

//