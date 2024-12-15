const express = require("express");
const { deleteFavourite } = require("../controllers/favourites.controllers");
const favouriteRouter = express.Router();

// favourite router //
favouriteRouter
.route("/:id")
.delete(deleteFavourite);

module.exports = favouriteRouter;