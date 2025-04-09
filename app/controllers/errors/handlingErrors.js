exports.handleMethodNotAllowed = (req, res) => {
  res.status(405).json({msg: 'Sorry, method not allowed.'})
};

exports.handleInvalidEndpoint = (req, res) => {
res.status(404).json({msg: 'Sorry, invalid endpoint.'})
};

// err.code 23503 : foreign_key_violation
// err.code 42703 : undefined_column
// err.code 23P01 : exclusion_violation (for bookings overlap)

exports.handleNotFound = (err, req, res, next) => {
  if(err.code === "22003" || err.code === "23503" || err.code === '42703' ||err.status === 404 ) {
    res.status(404).json({msg: 'Sorry, not found.'}) 
  } else if (err.code === "23P01" || err.status === "23P01") { 
    res.status(404).json({msg: 'Sorry, overlapping dates.'})
  } else if(err.code === "23505") {
    res.status(400).json({msg: "User already exists."})
  }else {
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

// err.code 22P02 : invalid_text_representation
// err.code 23514 : check_violation
// err.code 22007 : invalid_datetime_format
// err.code 23502 : not_null_violation 
// err.code 23505 : not_null_violation email

exports.handleBadRequest = (err, req, res, next) => {
  if(err.code === "22P02" || err.code === "23514" || err.code === "22007" || err.code === "23502" || err.status === 400) {
    // res.status(400).json({msg: 'Sorry, bad request.'})
    res.status(400).send(err)
  }  else {
    next(err)
  }
};



