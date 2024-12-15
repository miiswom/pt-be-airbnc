const express = require("express");
const { getUserById, patchUser } = require("../controllers");
const { handleMethodNotAllowed } = require("../errors")
const usersRouter = express.Router()

// users router //
usersRouter
.route('/:id')
.get(getUserById)
.patch(patchUser)
.all(handleMethodNotAllowed);

module.exports = usersRouter;