const express = require("express");
const path = require("path")
const { handleNotFound, handleBadRequest, handleInvalidEndpoint } = require("./controllers/errors/handlingErrors")
const app = express();
const apiRouter = require("./routers/api.router");
const cookieParser = require("cookie-parser")
const cors = require("cors");
const session = require("cookie-session");
const { header } = require("express/lib/response");
const { TOKEN_SECRET} = process.env

app.use(express.json());
app.use("/index", express.static(path.join(__dirname, 'public')))

app.use(cookieParser())

app.use(cors());

app.use("/api", apiRouter);

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
//   "first_name": "Noura",
//   "surname": "Fahed",
//   "email": "numberone@example.com",
//   "password": "number111",
//   "phone_number": "+447000151515",
//   "role": "guest",
//   "avatar": "https://images.unsplash.com/photo-1534701640286-bc6b3588b776?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
// }

// {
//   "first_name": "Gemma",
//   "surname": "Doherty",
//   "email": "numbertwo@example.com",
//   "password": "number222",
//   "phone_number": "+447000161616",
//   "role": "host",
//   "avatar": "https://images.unsplash.com/photo-1525956573220-b13e327ec7a0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
// }


// {
//   "first_name": "Bill",
//   "surname": "Farmer",
//   "email": "numberthree@example.com",
//   "password": "number333",
//   "phone_number": "+447000171717",
//   "role": "host",
//   "avatar": "https://images.unsplash.com/photo-1525956573220-b13e327ec7a0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
// }

// {
//   "first_name": "Frank",
//   "surname": "Peter",
//   "email": "numberfour@example.com",
//   "password": "number444",
//   "phone_number": "+447000181818",
//   "role": "guest",
//   "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
// }

// {
//   "first_name": "Amir",
//   "surname": "Fulani",
//   "email": "numbertwo@example.com",
//   "password": "number555",
//   "phone_number": "+447000191919",
//   "role": "guest",
//   "avatar": "https://images.unsplash.com/photo-1736438615469-5b27a6243975?q=80&w=2081&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
// }