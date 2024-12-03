const db = require("../db/connection");
const format = require("pg-format");

exports.fetchProperties = (maxprice, minprice, sort, order, host) => {
  let queryStr = `SELECT properties.property_id,
                          properties.name AS property_name,
                          location,
                          price_per_night,
                          CONCAT(first_name, ' ', surname) AS host
                    FROM properties
                    JOIN users
                    ON properties.host_id = users.user_id
                    JOIN favourites
                    ON properties.property_id = favourites.property_id`;
  const defaultSort = ` ORDER BY favourites.guest_id`;
  const defaultOrder = ` ASC`
  if(maxprice) {
    queryStr += format(` WHERE price_per_night < (%L)`, [maxprice])
  }
  if(!sort) {
    queryStr += defaultSort
  };
  if(!order) {
    queryStr += defaultOrder
  }
  return db.query(queryStr)
  .then(({rows}) => { return rows })
};