const db = require("../db/connection");
const format = require("pg-format");

exports.fetchProperties = (maxprice, minprice, sort, order, host) => {
  let queryStr = `SELECT  favourites.property_id,
                          properties.name AS property_name,
                          location,
                          price_per_night,
                          CONCAT(first_name, ' ', surname) AS host
                    FROM properties
                    JOIN users
                    ON properties.host_id = users.user_id
                    JOIN favourites
                    ON properties.property_id = favourites.property_id`;
  const defaultSort = ` ORDER BY favourites.property_id`;
  const defaultOrder = ` ASC`;
  const validSortKeys = ['property_id', 'property_name', 'location', 'price_per_night', 'host']

  if (maxprice) { 
    queryStr += format(` WHERE price_per_night < (%L)`, [maxprice]) 
  }
  if (minprice) { 
    queryStr += format(` WHERE price_per_night > (%L)`, [minprice]) 
  }
  if(sort) {
    if (sort && validSortKeys.includes(sort)) { 
      queryStr += ` ORDER BY ${sort}` 
    } else if(sort === 'popularity') {
      console.log("kjasndksjdn")
      queryStr += defaultSort
    } else {
      queryStr = ""
      return db.query(queryStr).then(({ rows }) => {
            return rows = undefined
        })
    }
  }
  if(order) {
    if(order === 'ascending') {
      const asc = order.slice(0, 3)
      queryStr += (" " + asc)
    } else if(order === 'descending') {
      const desc = order.slice(0, 4)
      queryStr += (" " + desc)
    } else {
      queryStr = ""
      return db.query(queryStr).then(({ rows }) => {
            return rows = undefined
        })
    }
  }
  if (!sort ) { 
    queryStr += defaultSort 
  }
  if (!order) {  
    queryStr += defaultOrder 
  }
console.log(queryStr)
  return db.query(queryStr).then(({ rows }) => {
      if (rows.length === 0 || !rows) {
        return rows = undefined;
      } else {
        return rows
      }
    })
};