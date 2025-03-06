const { createFavourite, removeFavourite, fetchFavourites  } = require("../models/favourites.models");
// favourites

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
};

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

exports.getFavourites = (req, res, next) => {
  fetchFavourites()
  .then((favourites) => {
    if (!favourites) {
      next(err)
    }
    res.status(200).json({favourites})
  })
  .catch((err) => {
    next(err)
  })
}