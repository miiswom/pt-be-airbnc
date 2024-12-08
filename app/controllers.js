const asyncHandler = require("express-async-handler");
const { fetchProperties, fetchPropertyById, createFavourite, removeFavourite, fetchPropertyReviews, calcAverageRating, createReview, removeReview } = require("./models");
const { handleBadRequest } = require("./errors");

exports.getProperties = (req, res, next) => {
  const { maxprice, minprice, sort, order, host } = req.query
  try {
    fetchProperties(maxprice, minprice, sort, order, host)
      .then((properties) => {
        if (!properties) {
          return next()
        }
        return res.status(200).json({ properties })
      })
  } catch (err) {
    console.log(err)
  }
};

exports.postNewFavourite = (req, res, next) => {
  const { guest_id } = req.body;
  const { id } = req.params;
  try {
    createFavourite(guest_id, id).then((favourite) => {
      if (!favourite) {
        return next()
      }
      return res.status(201).json({ msg: 'Property favourited successfully.', favourite_id: favourite.favourite_id })
    })
  } catch (err) {
    handleBadRequest(req, res)
  }
};

exports.deleteFavourite = (req, res, next) => {
  const { id } = req.params;
  try {

    removeFavourite(id).then((favourite) => {
      if (!favourite) {
        return next()
      }
      return res.status(204).send({})
    })
  } catch (err) {
    handleBadRequest(req, res)
  }
};

// --- Blocker: --- //

exports.getPropertyById = async (req, res, next) => {
  const { id } = req.params;
  try {
    fetchPropertyById(req, res, id).then((property) => {
      if (property === undefined) {
        return next()
      }
      if (property === 'Bad request.') {
        return res.status(400).json({ msg: 'Sorry, bad request.' })
      }
      return res.status(200).json({ property: property })
    })
  } catch (error) {
  }
};

exports.getPropertyReview = async (req, res, next) => {
  const { id } = req.params
  try {
    const reviews = await fetchPropertyReviews(id);
    const average_rating = await calcAverageRating(reviews);
    if (!reviews) {
      return next()
    }
    return res.status(200).json({ reviews, average_rating })
  } catch (err) {
    handleBadRequest(req, res, next)
  }
};

exports.postNewReview = (req, res, next) => {
  const { guest_id, rating, comment } = req.body;
  const { id } = req.params
  try{
    createReview(id, guest_id, rating, comment).then((review) => {   
      if(!review) {
        return next()
      }   
      if(review === 'Bad request.') {
        return res.status(400).json({ msg: 'Sorry, bad request.' })
      }
      res.status(201).json(review)
    })
  } catch(err) {

  }
};

exports.deleteReview = (req, res, next) => {
  const {id} = req.params;

  try {
    removeReview(id).then((review) => {
      if(!review) {
        return next()
      }
      return res.status(204).json({})
    })
  } catch(err) {
      handleBadRequest(req, res)
  }
}

