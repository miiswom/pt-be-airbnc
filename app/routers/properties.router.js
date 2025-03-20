const express = require("express");
const {getProperties, getPropertyById, getPropertyReview, getPropertyBookings, postPropertyBooking } = require("../controllers/properties.controllers");
const { postNewFavourite } = require("../controllers/favourite.controllers");
const { postNewReview } = require("../controllers/reviews.controllers")
const { handleMethodNotAllowed } = require("../controllers/errors/handlingErrors");
const { verifyToken } = require("./utils/verifyToken");
const { JWTAuthMiddleware } = require("./utils/JWTAuthMiddleware");
const propertiesRouter = express.Router();
const {verifyJWT} = require("./utils/verifyJWT")

// properties router //
propertiesRouter
.route("/")
.get(getProperties);

propertiesRouter
.route("/:id")
.get(verifyJWT, getPropertyById)

propertiesRouter
.route("/:id/favourite")
.post(postNewFavourite);

propertiesRouter
.route("/:id/reviews")
.get(getPropertyReview)
// .post(verifyToken, postNewReview);
.post(postNewReview);

// bookings 
propertiesRouter
.route("/:id/bookings")
.get(getPropertyBookings);

propertiesRouter
.route("/:id/booking")
.post(postPropertyBooking);

propertiesRouter
.route("/?(*)?")
.all(handleMethodNotAllowed);



module.exports = propertiesRouter;

//