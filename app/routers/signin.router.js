const express = require("express");
const siginRouter =  express.Router();
const { handleMethodNotAllowed } = require("../controllers/errors/handlingErrors");
const {getUserToken} = require("../controllers/signin.controller")

siginRouter
.route("")
.post(getUserToken)
.all(handleMethodNotAllowed);


module.exports = siginRouter;