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
      console.log(err)
      next(err)
    })

};

exports.postNewFavourite = (req, res, next) => {
  const { guest_id } = req.body;
  const { id } = req.params;
  createFavourite(guest_id, id)
    .then((favourite) => {
      if (!favourite) {
        next(err)
      }
      res.status(201).json({ msg: 'Property favourited successfully.', favourite_id: favourite.favourite_id })
    })
    .catch((err) => {
      console.log("2")
      console.log(err)
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
      console.log("2")
      next(err)
    })
};

exports.getPropertyById = async (req, res, next) => {
  const { id } = req.params;
  fetchPropertyById(req, res, id).then((property) => {
    if (!property) {
      next(err)
    }
    res.status(200).json({ property: property })
  }).catch((err) => {
    next(err)
  })
};

exports.getPropertyReview = async (req, res, next) => {
  const { id } = req.params
  try {
    const reviews = await fetchPropertyReviews(id);
    const average_rating = await calcAverageRating(reviews);
    if (!reviews) {
      next(err)
    } else {
      res.status(200).json({ reviews, average_rating })
    }
  } catch (err) {
    console.log("2")
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
console.log(req.body)
const { id } = req.params
updateUser(id, first_name, surname, email, phone, avatar)
.then((user) => {
  console.log(user)
  res.status(200).json(user)
}).catch((err) => {
  next(err)
})
}





