const express = require("express");
const { deleteFavourite, getFavourites } = require("../controllers/favourite.controllers");
const { handleMethodNotAllowed } = require("../controllers/errors/handlingErrors");
const favouriteRouter = express.Router();

// favourite router //
favouriteRouter
.route("/")
.get(getFavourites)

favouriteRouter
.route("/:id")
.delete(deleteFavourite)
.all(handleMethodNotAllowed)

module.exports = favouriteRouter;