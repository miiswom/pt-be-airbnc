const { compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET} = process.env


// (2) ===========> function to verify token
exports.verifyAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader)
  if(authHeader) {
    let token = authHeader.split(" ")[1];
    try {
      jwt.verify(token, TOKEN_SECRET, (err, decoded)=> {
        if(err) {
          res.status(403).json({msg: "Invalid token."})
        } else {
          next()
        }
      })
    } catch(err) {
      // console.log(err)
      res.status(404).json({msg: "Invalid credentials."})
    }
  } else {
    res.status(401).json({msg: "You need a token."})
  }
}