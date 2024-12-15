const express = require("express");
const { deleteReview } = require("../controllers/reviews.controllers");
const { handleMethodNotAllowed } = require("../errors")
const reviewsRouter = express.Router();


// review router //
reviewsRouter
.route("/:id")
.delete(deleteReview)
.all(handleMethodNotAllowed);

module.exports = reviewsRouter;