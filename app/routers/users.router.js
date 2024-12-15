const express = require("express");
const { getUserById, patchUser } = require("../controllers/users.controllers");
const { handleMethodNotAllowed } = require("../")
const usersRouter = express.Router()

// users router //
usersRouter
.route('/:id')
.get(getUserById)
.patch(patchUser)
.all(handleMethodNotAllowed);

module.exports = usersRouter;