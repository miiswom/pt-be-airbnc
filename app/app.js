const express = require("express");
const path = require("path")
const { handleNotFound, handleBadRequest, handleInvalidEndpoint } = require("./controllers/errors/handlingErrors")
const app = express();
const apiRouter = require("./routers/api.router");
const cookieParser = require("cookie-parser")
const cors = require("cors");
const session = require("express-session")
const { TOKEN_SECRET} = process.env

app.use(express.json());
app.use("/index", express.static(path.join(__dirname, 'public')))
app.use(cors({
  origin: `http://localhost:5173`,
  credentials: true
}))
app.use(cookieParser())

app.use(session({
  key: "userId",
  secret: TOKEN_SECRET,
  resave: false,
  saveUninitialized: false, 
  cookie: {
    expires: 60 * 60 * 24
  }
}))

app.use("/api", apiRouter);

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  
  if(!token) {
    res.status(401).json({msg: "You need a token"})
  } else {
    jwt.verify(token , TOKEN_SECRET, (err, decoded) => {
      if(err) {
        res.status().json({auth: false, msg: "Authentication failed."})
      } else {
        req.userId = decoded.user_id;
        next()
      }
    })
  }
}

app.get("/isUserAuth", verifyJWT, (req , res) => {
  res.json({msg: "You are authenticated"})
})
// invalid enpoint //
app.all("*", handleInvalidEndpoint);

// // error middleware //
app.use("*", handleBadRequest, handleNotFound )

module.exports = app;








// {
//   "email" : "alice@example.com",
//   "password": "111111111111"
// }


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