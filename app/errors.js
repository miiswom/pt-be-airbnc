exports.handleMethodNotAllowed = (req, res) => {
  res.status(405).json({msg: 'Sorry, method not allowed.'})
};

exports.handleInvalidEndpoint = (req, res) => {
res.status(404).json({msg: 'Sorry, invalid endpoint.'})
};

// err.code 23503 means couldn't find data in the table
// err.code 42703 means column does not exist
exports.handleNotFound = (err, req, res, next) => {
  if(err.code === "22003" || err.code === "23503" || err.code === '42703' ||err.status === 404 ) {
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

// err.code 23514 means wrong typeof 
exports.handleBadRequest = (err, req, res, next) => {
  if(err.code === "22P02" || err.code === "23514" ||err.status === 400) {
    res.status(400).json({msg: 'Sorry, bad request.'})
  }else {
    next(err)
  }
};



