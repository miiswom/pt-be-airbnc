const express = require("express");
const {getProperties, getPropertyById, getPropertyReview } = require("../controllers/properties.controllers");
const { postNewFavourite } = require("../controllers/favourites.controllers");
const { postNewReview } = require("../controllers/reviews.controllers")
const { handleMethodNotAllowed } = require("../errors");
const propertiesRouter = express.Router();

// properties:id router //
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

propertiesRouter
.route("/?(*)?")
.all(handleMethodNotAllowed);

module.exports = propertiesRouter;