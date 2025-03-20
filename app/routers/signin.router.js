const express = require("express");
const signinRouter =  express.Router();
const { handleMethodNotAllowed } = require("../controllers/errors/handlingErrors");
const {getUserToken} = require("../controllers/signin.controller")

signinRouter
.route("")
.post(getUserToken)
.all(handleMethodNotAllowed);


module.exports = signinRouter;