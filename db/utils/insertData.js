const db = require("../connection");
const format = require("pg-format");

function getId(host_name) {
  const users = require("../data/test/users.json");
  const id = users.findIndex((user) => host_name.split(" ")[0] === user.first_name && host_name.split(" ")[1] === user.surname)
  return id + 1
};

function getPropId(property_name) {
  const properties = require("../data/test/properties.json");
  const id = properties.findIndex((property) => property_name === property.name)
  return id + 1
};

exports.insertUser = () => {
  const users = require("../data/test/users.json")
    .map((user) => [user.first_name,
    user.surname,
    user.email,
    user.phone_number,
    user.role,
    user.avatar])

  return db.query(format(`INSERT INTO users( first_name, 
                                      surname, 
                                      email, 
                                      phone_number, 
                                      role, 
                                      avatar) VALUES %L RETURNING *;`, users))
    .then(({ rows }) => { return rows })

};

exports.insertPropertyTypes = () => {
  const formattedPropTypes = require("../data/test/property-types.json")
    .map((type) => [type.property_type,
    type.description]);

  return db.query(format(`INSERT INTO property_types(property_type, description) VALUES %L RETURNING *;`, formattedPropTypes))
    .then(({ rows }) => { return rows })
};

exports.insertProperties = () => {
  const formattedProperties = require("../data/test/properties.json")
    .map((property) => [property.host_id = getId(property.host_name),
    property.name,
    property.location,
    property.property_type,
    property.price_per_night,
    property.description]);

  return db.query(format(`INSERT INTO properties( host_id,
                                                  name,
                                                  location, 
                                                  property_type,
                                                  price_per_night,
                                                  description) VALUES %L RETURNING *;`, formattedProperties))
    .then(({ rows }) => { return rows });
};

exports.insertReviews = () => {
  const formattedReviews = require("../data/test/reviews.json")
    .map((review) => [review.property_id = getPropId(review.property_name),
    review.guest_id = getId(review.guest_name),
    review.rating,
    review.comment])

  return db.query(format(`INSERT INTO reviews( property_id,
                                                guest_id,
                                                rating, 
                                                comment) VALUES %L RETURNING *;`, formattedReviews))
    .then(({ rows }) => { return rows });
};

exports.insertFavourites = () => {
  const formattedFavourites = require("../data/test/favourites.json")
  .map((favourite) => [
    favourite.guest_id = getId(favourite.guest_name),
    favourite.property_id = getPropId(favourite.property_name)])

  return db.query(format(`INSERT INTO favourites( guest_id,
                                                  property_id) VALUES %L RETURNING *;`, formattedFavourites))
    .then(({ rows }) => { 
      if(rows.length === 0) {
        return Promise.reject({msg: 'Not found'})
      } else {
        return Promise.resolve({rows})
      }
     });
};