const express = require("express")
const favouriteRouter = express.Router();
const { deleteFavourite } = require("../controllers");

// favourite router //
favouriteRouter
.route("/:id")
.delete(deleteFavourite);

module.exports = favouriteRouter;