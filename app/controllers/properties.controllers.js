const { fetchProperties, fetchPropertyById, fetchPropertyReviews, calcAverageRating} = require("../models/properties.models")
// properties 
exports.getProperties = (req, res, next) => {
  const { maxprice, minprice, sort, order, host } = req.query
  fetchProperties(maxprice, minprice, sort, order, host)
    .then((properties) => {
      if (!properties) {
        next(err)
      }
      res.status(200).json({properties})
    })
    .catch((err) => {
      next(err)
    })

};

exports.getPropertyById = (req, res, next) => {
  const { id } = req.params;
  fetchPropertyById(id).then((property) => {
    if (!property) {
      next(err)
    } else {
      res.status(200).json({ property })
    }
  }).catch((err) => {
    next(err)
  })
};

exports.getPropertyReview = async (req, res, next) => {
  const { id } = req.params;
  try {
    const reviews = await fetchPropertyReviews(id);
    const average_rating = await calcAverageRating(reviews);
    if (!reviews) {
      next(err)
    } else {
      res.status(200).json({ reviews, average_rating })
    }
  } catch (err) {
    next(err)
  }
};