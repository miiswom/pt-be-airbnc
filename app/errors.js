exports.handleBadRequest = (req, res) => {
  return res.status(400).send({msg: 'Sorry, bad request.'})
};

exports.handleMethodNotAllowed = (req, res) => {
  return res.status(405).send({msg: 'Sorry, method not allowed.'})
}

