const jwt = require("jsonwebtoken")
const { TOKEN_SECRET } = process.env;
const { createUser} = require("../models/signup.models")

exports.getNewUserToken = (req, res, next) => {
// user: {first_name, surname, email, phone_number, role, avatar, password_hash}
const {firstname, surname, email, phone_number, role, avatar, password} = req.body
const newUser = [firstname, surname, email, phone_number, role, avatar, password];
console.log(newUser)

createUser(newUser).then((newUser) => {
  if(!newUser) {
    console.log(newUser)
    res.status(400).json({msg: "An error occured."})
  } else {
    const token = jwt.sign({newUser, iat: Date.now()}, TOKEN_SECRET)
    res.status(201).json({token})
  }
}).catch((err) => {
  console.log(err)
  res.status
})
}