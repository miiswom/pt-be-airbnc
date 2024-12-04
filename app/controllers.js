const asyncHandler = require("express-async-handler");
const { fetchProperties, fetchPropertyById,  createFavourite, removeFavourite} = require("./models")

exports.getProperties = (req, res, next) => {
  const {maxprice, minprice, sort, order, host} = req.query
  try{
      fetchProperties(maxprice, minprice, sort, order, host)
      .then((properties) => {
        if(!properties) {
          return next()
        }
        return res.status(200).json({properties})
      })
  } catch(err) {
    console.log(err)
  }
  
    
};

exports.postNewFavourite = (req, res, next) => {
  const { guest_id} = req.body;
  const {id} = req.params;
  try {
    createFavourite(guest_id, id).then((favourite) => {
      if(!favourite) {
        return next()
      }
      return res.status(201).json({msg: 'Property favourited successfully.', favourite_id: favourite.favourite_id})
    })
  } catch (err) {
    console.log(err)
  }
};

exports.deleteFavourite = (req, res, next) => {
  const { id } = req.params;
  try {
    removeFavourite(id).then((favourite) => {
      if(!favourite) {
       return next()
      }
      return res.status(204).send({})
    })
  } catch(err) {

  }
};

exports.getPropertyById = (req, res, next) => {
  const { id } = req.params;
  console.log(`fecthing prop ${id}`)

  try {
    fetchPropertyById(id).then((property) => {
      return res.status(200).json({property: property})
    })
  } catch (err) {
    
  }
}