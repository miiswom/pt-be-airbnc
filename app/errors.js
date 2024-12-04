exports.handleNotFound = (req, res) => {
  return res.status(404).json({msg: 'Sorry, not found.'})
}

exports.handleBadRequest = (req, res) => {
  return res.status(400).json({msg: 'Sorry, bad request.'})
};

exports.handleMethodNotAllowed = (req, res) => {
  return res.status(405).json({msg: 'Sorry, method not allowed.'})
};

