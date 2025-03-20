const express = require("express");
const signoutRouter =  express.Router();
const { handleMethodNotAllowed } = require("../controllers/errors/handlingErrors");
const {removeToken} = require("../controllers/signout.controller")

signoutRouter
.route("")
.get(removeToken)
.all(handleMethodNotAllowed);


module.exports = signoutRouter;