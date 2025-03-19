const express = require("express");
const path = require("path")
const { handleNotFound, handleBadRequest, handleInvalidEndpoint } = require("./controllers/errors/handlingErrors")
const app = express();
const apiRouter = require("./routers/api.router");


app.use(express.json());
app.use("/index", express.static(path.join(__dirname, 'public')))

app.use("/api", apiRouter);

// invalid enpoint //
app.all("*", handleInvalidEndpoint);

// // error middleware //
app.use("*", handleBadRequest, handleNotFound )
















// const jwt = require("jsonwebtoken")
// const { TOKEN_SECRET } = process.env;
// const bcrypt = require("bcrypt")
// const { createReview } = require("./models/reviews.models");
// const { fetchUserByCredentials, createUser } = require("./models/users.models");
// // (1) ===========> route to allow signin / signup

// app.post("/api/signup", (req, res, next) => {
//   // user: {first_name, surname, email, phone_number, role, avatar, password_hash}
//   const {firstname, surname, email, phone_number, role, avatar, password} = req.body
//   const newUser = [firstname, surname, email, phone_number, role, avatar, password];
//   console.log(newUser)

//   createUser(newUser).then((newUser) => {
//     if(!newUser) {
//       console.log(newUser)
//       res.status(400).json({msg: "An error occured."})
//     } else {
//       const token = jwt.sign({newUser, iat: Date.now()}, TOKEN_SECRET)
//       res.status(201).json({token})
//     }
//   }).catch((err) => {
//     console.log(err)
//     res.status
//   })


// })

// // (2) ===========> function to verify token
// function verifyToken(req, res, next) {
//   // get the auth header value so that when we send out token, we send it to the header
//   const bearerHeader = req.headers['authorization']

//   // check if bearer is undefined
//   if (typeof bearerHeader !== 'undefined') {
//     const bearer = bearerHeader.split(" "); //<--- split the bearerHeader at the space
//     const bearerToken = bearer[1]  //<--- get token from array
//     req.token = bearerToken     //<--- set the token to the req object
//     next()
//   } else {
//     // Forbidden user
//     res.status(403).json({ msg: 'Sorry, not allowed...' })
//   }
// }

// app.post("/api/properties/:id/review", verifyToken, (req, res, next) => {
//   const { guest_id, rating, comment } = req.body;
//   const { id } = req.params;
//   console.log(id, guest_id, rating, comment)

//   jwt.verify(req.token, TOKEN_SECRET, (err, authData) => {
//     if (err) {
//       res.status(403).json('Forbiden access')
//     } else {
//       createReview(id, guest_id, rating, comment)
//         .then((review) => {
//           console.log("review", review)
//           if (!review) {
//             next(err)
//           }
//           res.status(201).json(review)
//         }).catch((err) => {
//           next(err)
//         })
//     }
//   })

// })

module.exports = app;

// {
//   "guest_id": "1",
//   "rating": "2",
//   "comment": "testing once again..."
// }

// {
//   "firstname": "Test",
//   "surname": "Numberone",
//   "email": ""numberone@example.com",
//   "password": "numberone111",
//   "phone_number": "+44 7000 151515",
//   "role": "guest",
//   "avatar": "https://images.unsplash.com/photo-1534701640286-bc6b3588b776?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
// }

// {
//   "firstname": "Test",
//   "surname": "Numbertwo",
//   "email": "numbertwo@example.com",
//   "password": "numberone222",
//   "phone_number": "+44 7000 161616",
//   "role": "host",
//   "avatar": "https://images.unsplash.com/photo-1525956573220-b13e327ec7a0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
// }