const jwt = require("jsonwebtoken")
const { TOKEN_SECRET } = process.env;
const { createUser} = require("../models/signup.models")

exports.getNewUserToken = (req, res, next) => {
const {first_name, surname, email, phone_number, role, avatar, password} = req.body
const newUser = [first_name, surname, email, phone_number, role, avatar, password];
console.log(newUser)

createUser(newUser).then((newUser) => {
  if(!newUser) {
    console.log(newUser)
    res.status(400).json({msg: "An error occured."})
  } else {
    // const token = jwt.sign({newUser, iat: Date.now()}, TOKEN_SECRET)
    // res.status(201).json({token})
    const payload = { id: newUser[0].user_id }
    const token = jwt.sign(payload, TOKEN_SECRET, {expiresIn: "1d"})
    try {
      res
    .status(200)
    .json({
      msg: `Successful sign-up, welcome ${newUser[0].first_name}!`,
      token: token
    })
    } catch (error) {
      console.log("we are in a try/catch")
      next(error)
    }
    
  }
}).catch((err) => {
  console.log("we are in a catch")
  console.log(err)
  next(err)
})
}