const jwt = require("jsonwebtoken");
const { TOKEN_SECRET} = process.env


// (2) ===========> function to verify token
exports.verifyToken = (req, res, next) => {
  // get the auth header value so that when we send out token, we send it to the header
  // const bearerHeader = req.headers['authorization']

  // // check if bearer is undefined
  // if (typeof bearerHeader !== 'undefined') {
  //   const bearer = bearerHeader.split(" "); //<--- split the bearerHeader at the space
  //   const bearerToken = bearer[1]  //<--- get token from array
  //   req.token = bearerToken     //<--- set the token to the req object
  //   next()
  // } else {
  //   // Forbidden user
  //   res.status(403).json({ msg: 'Sorry, not allowed...' })
  // }

  const authHeaders = req.headers['authorization'];
  console.log(authHeaders)

  if(authHeaders) {
    const token = authHeaders.split(" ")[1];
    const decodedToken = jwt.verify(token, TOKEN_SECRET)
    console.log(decodedToken)
    if(decodedToken) {
      next()
    } else {
      res.status(403).json({msg: "Forbidden access"})
    }
  } else {
    res.status(401).json({msg: "Unauthorised."})
  }
}