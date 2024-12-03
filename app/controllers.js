const asyncHandler = require("express-async-handler");
const { fetchProperties } = require("./models")

exports.getProperties = (req, res, next) => {
  const {maxprice, minprice, sort, order, host} = req.query
  try{
    
      fetchProperties(maxprice, minprice, sort, order, host)
      .then((properties) => {
        if(properties === undefined) {
          return res.status(404).send({msg: 'Sorry, not found.'})
        } else if(!properties) {
          next()
        }
        return res.status(200).json({properties})
      })
    
  } catch(err) {
    console.log(err)
  }
  
    
}