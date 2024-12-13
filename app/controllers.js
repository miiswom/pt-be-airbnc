const { fetchProperties, fetchPropertyById, createFavourite, removeFavourite, fetchPropertyReviews, calcAverageRating, createReview, removeReview, fetchUserById, updateUser} = require("./models");

exports.getProperties = (req, res, next) => {
  const { maxprice, minprice, sort, order, host } = req.query
  fetchProperties(maxprice, minprice, sort, order, host)

    .then((properties) => {
      if (!properties) {
        next(err)
      }
      res.status(200).json({ properties })
    })
    .catch((err) => {
      next(err)
    })

};

exports.postNewFavourite = (req, res, next) => {
  const { guest_id } = req.body;
  const { id } = req.params;
  createFavourite(id, guest_id)
    .then((favourite) => {
      if (!favourite) {
        next(err)
      }
      res.status(201).json({ msg: 'Property favourited successfully.', favourite_id: favourite.favourite_id })
    })
    .catch((err) => {

      next(err)
    })
}

exports.deleteFavourite = (req, res, next) => {
  const { id } = req.params;
  removeFavourite(id)
    .then((favourite) => {
      if (!favourite) {
        next(err)
      }
      res.status(204).json({})
    }).catch((err) => {
      next(err)
    })
};

exports.getPropertyById = (req, res, next) => {
  const { id } = req.params;
  fetchPropertyById(id).then((property) => {
    if (!property) {
      next(err)
    } else {
      res.status(200).json({property})
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

exports.postNewReview = (req, res, next) => {
  const { guest_id, rating, comment } = req.body;
  const { id } = req.params

  createReview(id, guest_id, rating, comment)
    .then((review) => {
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
    }).catch((err) => { next(err) })
};

exports.getUserById = (req, res, next) => {
  const { id } = req.params;
  fetchUserById(id).then((user) => {
    if(!user) {
      next(err)
    }
    res.status(200).json({user})
  }).catch((err) => {
    next(err)
  })
};

exports.patchUser = (req, res, next) => {
const { first_name, surname, email, phone, avatar } = req.body
const { id } = req.params
updateUser(id, first_name, surname, email, phone, avatar)
.then((user) => {
    res.status(200).json({user})
}).catch((err) => {
  //console.log(err)
  next(err)
})
}





