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
    .map((user) => [
    user.first_name,
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
    .then(({ rows }) => { return rows });
};

exports.insertImages = () => {
  const images = require("../data/test/images.json")
  const formattedImages = images.map((image, i) => [
    image.image_id = i+1,
    image.property_id = getPropId(image.property_name),
    image.image_url,
    image.alt_text = image.alt_tag
  ])
  return db.query(format(`INSERT INTO images(  image_id, 
                                        property_id,
                                        image_url,
                                        alt_text) VALUES %L RETURNING *;`, formattedImages))
            .then(({rows}) => { return rows})
};

exports.insertBookings = () => {
  const bookings = require("../data/test/bookings.json");
  const formattedBookings = bookings.map((booking, i) => [
    booking.property_id = getPropId(booking.property_name),
    booking.guest_id = getId(booking.guest_name),
    booking.check_in_date,
    booking.check_out_date
  ])
  return db.query(format(`INSERT INTO bookings( property_id,
                                                guest_id,
                                                check_in_date,
                                                check_out_date) VALUES %L RETURNING *;`, formattedBookings))
            .then(({rows}) => { return rows })
};