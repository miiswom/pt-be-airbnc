const { createReview, removeReview } = require("../models/reviews.models");

// reviews 

// ===========> route I want to protect
exports.postNewReview = (req, res, next) => {
  const { guest_id, rating, comment } = req.body;
  const { id } = req.params
  // ===========> where I need to verify
  createReview(id, guest_id, rating, comment)
    .then((review) => {
      console.log("review", review)
      if (!review) {
        next(err)
      }
      res.status(201).json(review)
    }).catch((err) => {
      next(err)
    })
};

exports.deleteReview = (req, res, next) => {
  const { id } = req.params;
  removeReview(id)
    .then((review) => {
      if (!review) {
        next(err)
      }
      res.status(204).json({})
    }).catch((err) => { 
      next(err) 
  })
};