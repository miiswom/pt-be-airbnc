exports.handleMethodNotAllowed = (req, res) => {
  res.status(405).json({msg: 'Sorry, method not allowed.'})
};

exports.handleInvalidEndpoint = (req, res) => {
res.status(404).json({msg: 'Sorry, invalid endpoint.'})
};

exports.handleNotFound = (err, req, res, next) => {
  if(err.code === "22003" || err.status === 404 ) {
    res.status(404).json({msg: 'Sorry, not found.'})
  } else {
    next(err)
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if(err.status) {
    res.status(err.status).json({msg: err.msg})
  } else {
    next(err)
  }
};

exports.handleBadRequest = (err, req, res, next) => {
  if(err.code === "22P02" || err.status === 400) {
    res.status(400).json({msg: 'Sorry, bad request.'})
  }else {
    next(err)
  }
};



