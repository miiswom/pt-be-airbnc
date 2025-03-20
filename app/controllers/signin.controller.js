const jwt = require("jsonwebtoken")
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const bcrypt = require("bcrypt")
const { fetchUserByCredentials } = require("../models/signin.models");
const { generateAcessToken, generateRefreshToken } = require("./utils/generateTokens");
const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken"
// (1) ===========> route to allow signin / signup

exports.getUserToken = ((req, res, next) => {
  const { email, password } = req.body;
  const user = { email, password }
  console.log(user)

  // fetching and checking the user's exist:
  fetchUserByCredentials(email).then(async (user) => {
    // const password_hash = await bcrypt.hash(password, 10);
    console.log(user.password_hash)

    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    console.log(passwordMatch)
    if (passwordMatch) {
      // jwt.sign({ user }, TOKEN_SECRET, (err, token) => {
      //   res.json({ token })
      // })
      const accessToken = generateAcessToken(user);
      res.cookie(ACCESS_TOKEN, accessToken, 
        { 
          httpOnly: true, 
          secure: true, 
          path: "/" 
        });

        console.log("accessToken", accessToken)
      const refreshToken = generateRefreshToken(user);
      res.cookie(REFRESH_TOKEN, refreshToken, 
        {
          httpOnly: true,
          secure: true,
          path: "/"
        })

      res.status(200).json({msg: "User logged in successfully", user})

    } else {
      res.status(403).json({ msg: "Incorrect credentials." })
    }
  }).catch((err) => {
    console.log(err)
    res.status(401).json({ msg: "Sorry, user not found." })
  })
})