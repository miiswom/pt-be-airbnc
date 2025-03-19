const jwt = require("jsonwebtoken")
const { TOKEN_SECRET } = process.env;
const bcrypt = require("bcrypt")
const { fetchUserByCredentials } = require("../models/signin.models");
// (1) ===========> route to allow signin / signup

exports.getUserToken = ((req, res, next) => {
  const { email, password } = req.body;
  const user = { email, password }
  console.log(password)


  // fetching and checking the user's exist:
  fetchUserByCredentials(email).then(async (user) => {
    // const password_hash = await bcrypt.hash(password, 10);
    console.log(user.password_hash)

    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    console.log(passwordMatch)
    if (passwordMatch) {
      jwt.sign({ user }, TOKEN_SECRET, (err, token) => {
        res.json({ token })
      })
    } else {
      res.status(403).json({ msg: "Incorrect credentials." })
    }
  }).catch((err) => {
    console.log(err)
    res.status(401).json({ msg: "Sorry, user not found." })
  })
})