const express = require("express");
const { deleteReview } = require("../controllers/reviews.controllers");
const { handleMethodNotAllowed } = require("../controllers/errors/handlingErrors");
const { verifyAuth } = require("./utils/verifyAuth");
const reviewsRouter = express.Router();


// review router //
reviewsRouter
.route("/:id")
.delete( verifyAuth ,deleteReview)
.all(handleMethodNotAllowed);

module.exports = reviewsRouter;