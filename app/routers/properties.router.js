const express = require("express");
const {getProperties, getPropertyById, getPropertyReview, getPropertyBookings, postPropertyBooking } = require("../controllers/properties.controllers");
const { postNewFavourite } = require("../controllers/favourite.controllers");
const { postNewReview } = require("../controllers/reviews.controllers")
const { handleMethodNotAllowed } = require("../controllers/errors/handlingErrors");
const { verifyAuth } = require("./utils/verifyAuth");
const { JWTAuthMiddleware } = require("./utils/JWTAuthMiddleware");
const propertiesRouter = express.Router();
const {verifyJWT} = require("./utils/verifyJWT");
const { verify } = require("jsonwebtoken");

// properties router //
propertiesRouter
.route("/")
.get(getProperties);

propertiesRouter
.route("/:id")
.get(getPropertyById)

propertiesRouter
.route("/:id/favourite")
.post(verifyAuth, postNewFavourite);

propertiesRouter
.route("/:id/reviews")
.get(getPropertyReview)
// .post(verifyToken, postNewReview);
.post(verifyAuth, ostNewReview);

// bookings 
propertiesRouter
.route("/:id/bookings")
.get(verifyAuth ,getPropertyBookings);

propertiesRouter
.route("/:id/booking")
.post(verifyAuth, postPropertyBooking);

propertiesRouter
.route("/?(*)?")
.all(handleMethodNotAllowed);



module.exports = propertiesRouter;

//