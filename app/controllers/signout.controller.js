exports.removeToken = (req, res, next) => {
  res.clearCookie('access_token')
  res.status(200).json({msg: "Logout successful."})
}