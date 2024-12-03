const asyncHandler = require("express-async-handler");
const { fetchProperties } = require("./models")

exports.getProperties = (req, res) => {
  const {maxprice, minprice, sort, order, host} = req.query
  fetchProperties(maxprice, minprice, sort, order, host)
    .then((properties) => {
      if(!properties) {
        res.status(404).send({msg})
      }
      res.status(200).json({properties})
    })
    
}