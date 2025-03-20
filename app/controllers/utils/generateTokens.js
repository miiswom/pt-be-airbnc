// create access token
const { TOKEN_SECRET } = process.env;
const jwt = require("jsonwebtoken")

exports.generateAcessToken = (user) => {
  return jwt.sign({ user }, TOKEN_SECRET, { expiresIn: "20s" })
};

exports.generateRefreshToken = (user) => {
  return jwt.sign({ user }, TOKEN_SECRET, { expiresIn: "1d" })
}