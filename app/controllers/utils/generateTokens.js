// create access token
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const jwt = require("jsonwebtoken")

exports.generateAcessToken = (user) => {
  console.log( "TOKEN_SECRET", TOKEN_SECRET)
  return jwt.sign({ user }, TOKEN_SECRET, { expiresIn: "20s" })
};

exports.generateRefreshToken = (user) => {
  return jwt.sign({ user }, TOKEN_SECRET, { expiresIn: "1d" })
}