const express = require("express");
const signupRouter = express.Router();
const { handleMethodNotAllowed } = require("../controllers/errors/handlingErrors");
const { getNewUserToken} = require("../controllers/signup.controllers")

signupRouter
.route("")
.post(getNewUserToken)
.all(handleMethodNotAllowed);

module.exports = signupRouter;