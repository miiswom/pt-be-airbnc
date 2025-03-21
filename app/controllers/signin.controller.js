const jwt = require("jsonwebtoken")
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const bcrypt = require("bcrypt")
const { fetchUserByCredentials } = require("../models/signin.models");
const { generateAcessToken, generateRefreshToken } = require("./utils/generateTokens");
const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken"
const Cookies = require("js-cookies")
// (1) ===========> route to allow signin / signup

// exports.getUserToken = ((req, res, next) => {
//   const { email, password } = req.body;
//   const user = { email, password }
//   console.log(user)
//   // fetching and checking the user's exist:
//   fetchUserByCredentials(email).then(async (user) => {
//     // const password_hash = await bcrypt.hash(password, 10);
//     console.log(user.password_hash)

//     const passwordMatch = await bcrypt.compare(password, user.password_hash)
//     console.log(passwordMatch)
//     if (passwordMatch) {
//       // jwt.sign({ user }, TOKEN_SECRET, (err, token) => {
//       //   res.json({ token })
//       // })
//       // const accessToken = generateAcessToken(user);
//       // res.cookie(ACCESS_TOKEN, accessToken, 
//       //   { 
//       //     httpOnly: true, 
//       //     secure: true, 
//       //     path: "http://localhost:5173" 
//       //   });

//       //   console.log("accessToken", accessToken)
//       // const refreshToken = generateRefreshToken(user);
//       // res.cookie(REFRESH_TOKEN, refreshToken, 
//       //   {
//       //     httpOnly: true,
//       //     secure: true,
//       //     path: "http://localhost:5173" 
//       //  })

//       const user_id = user.user_id;
//       console.log(user_id)
      
//       const token =  jwt.sign({ user_id }, TOKEN_SECRET, {expiresIn: 300})
//       res.cookie('access_token',token, 
//         { httpOnly: true, 
//           secure: true, 
//           maxAge: 3600000 })
//       .status(200).json(
//         {
//           msg: "User logged in successfully", 
//           auth: true,
//           token: token,
//           user: user
//         })
//       req.session.user = user;
//       // res.cookie = token;
//       // Cookies.set("token", token, { expiresIn: 300})
//       // console.log("req.session.user", req.session.user)
//       // console.log("res.cookie", res.cookie)

//     } else {
//       res.status(403).json({ msg: "Incorrect credentials.", auth: false })
//     }
//   }).catch((err) => {
//     console.log(err)
//     res.status(401).json({ msg: "User not found.", auth: false })
//   })
// })

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
    if (!passwordMatch) {
      res.status(400).json({msg: "Incorrect password."})
    }

    const payload = {id: user.user_id}
    const token = jwt.sign(payload, TOKEN_SECRET, {expiresIn: "1d"})

    res
    .cookie('access_token', token, { httpOnly: true, secure: true, path: "http://localhost:5173" }) 
    .status(200).json({msg: `Welcome back ${user.first_name}!`, token})
  }).catch((err) => {
    console.log(err)
    res.status(401).json({ msg: "User not found.", auth: false })
  })
})