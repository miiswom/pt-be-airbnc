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
    }

    const payload = { id: user.user_id }
    const token = jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1d" })

    res
      .status(200)
      .json({ msg: `Welcome back ${user.first_name}!`, success: true, token })
  }).catch((err) => {
    console.log(err)
    
    res
      .status(401)
      .json({ msg: "User not found.", auth: false })
  })
})