const jwt = require("jsonwebtoken")
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const bcrypt = require("bcrypt")
const { fetchUserByCredentials } = require("../models/signin.models");
const { generateAcessToken, generateRefreshToken } = require("./utils/generateTokens");
const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken"
const Cookies = require("js-cookies")
// (1) ===========> route to allow signin / signup

exports.getUserToken = ((req, res, next) => {
  const { email, password } = req.body;
  const user = { email, password }
  console.log(user)
  // fetching and checking the user's exist:
  fetchUserByCredentials(email).then(async (user) => {
    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    console.log(passwordMatch)

    if (!passwordMatch) {
    res.status(400).json({ msg: "Incorrect password." })
      // next()
    } else {
      const payload = { id: user.user_id }
      const token = jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1d" })
    res.status(201).json({ user_id: user.user_id, success: true, token })
  }
  }).catch((err) => {
    res.status(401).json({ msg: "User not found.", success: false })
  })
})