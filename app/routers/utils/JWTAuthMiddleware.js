const jwt = require("jsonwebtoken")
const { TOKEN_SECRET } = process.env
exports.JWTAuthMiddleware = (req, res, next) => {
  console.log(req.cookies)
  const token = req.cookies.accessToken;

  try {
    if(!token || token === undefined) {
      res.status(401).json({msg: "Sorry, unauthorised access."})
    }
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
      if(err) {
        console.log("err", err);
        res.status(403).json({msg: "Verification failed"});
        next()
      }
      req.user = user;
      next()
    })
  } catch (err) {
    console.log("err", err)
  }
}