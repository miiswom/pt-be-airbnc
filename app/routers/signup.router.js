const express = require("express");
const singupRouter = express.Router();
const { handleMethodNotAllowed } = require("../controllers/errors/handlingErrors");
const { getNewUserToken} = require("../controllers/signup.controllers")

singupRouter
.route("")
.post(getNewUserToken)
.all(handleMethodNotAllowed);

module.exports = singupRouter;