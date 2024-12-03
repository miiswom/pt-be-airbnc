exports.handleInvalid = (req, res) => {
  return res.status(400).send({msg: 'Sorry, bad request.'})
}