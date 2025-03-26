const express = require("express");
const { verifyAuth } = require("./utils/verifyAuth");
const protectedRouter = express.Router();

protectedRouter
.route("/")
.get(verifyAuth, (req,res,next) => {
  return res.status(200).json({
    success: true,
    msg: 'Sign-in successful.'
  })
})

module.exports = protectedRouter;