const jwt = require("jsonwebtoken");
const { TOKEN_SECRET} = process.env


exports.verifyJWT = (req, res, next) => {
  // const token = req.headers["x-access-token"];
  const token = req.cookies.access_token;
  console.log(token)
  
  if(!token) {
    res.status(401).json({msg: "You need a token"})
  } else {
    jwt.verify(token ,TOKEN_SECRET, (err, decoded) => {
      if(err) {
        res.status(403).json({auth: false, msg: "Authentication failed."})
      } else {
        req.userId = decoded.user_id;
        next()
      }
    })
  }
}