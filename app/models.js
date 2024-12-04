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
  const validSortKeys = ['property_id', 'property_name', 'location', 'price_per_night', 'host'];
  let defineOrder = ""

  if (maxprice) {
    queryStr += format(` WHERE price_per_night < (%L)`, [maxprice])
  }
  if (minprice) {
    queryStr += format(` WHERE price_per_night > (%L)`, [minprice])
  }
  if (sort) {
    if (sort && validSortKeys.includes(sort)) {
      queryStr += ` ORDER BY ${sort}`
    } else if (sort === 'popularity') {
      queryStr += defaultSort
    } else {
      queryStr = ""
      return db.query(queryStr).then(({ rows }) => {
        return rows = undefined
      })
    }
  }

  if (order) {
    if (order === 'ascending') {
      const asc = order.slice(0, 3)
      defineOrder += (" " + asc)
    } else if (order === 'descending') {
      const desc = order.slice(0, 4)
      defineOrder += (" " + desc)
    } else {
      queryStr = ""
      return db.query(queryStr).then(({ rows }) => {
        return rows = undefined
      })
    }
  }
  if (!sort) {
    queryStr += defaultSort
  }
  if (!order) {
    queryStr += defaultOrder
  }
  // console.log(queryStr + defineOrder)
  return db.query(queryStr + defineOrder).then(({ rows }) => {
    if (rows.length === 0 || !rows) {
      return rows = undefined;
    } else {
      return rows
    }
  })
};

exports.fetchFavourites = () => {
  return db.query(`SELECT * FROM favourites`)
    .then(({ rows }) => { return rows })
};

exports.createFavourite = (guest_id, id) => {
  if (guest_id === 0 || guest_id > 6) {
    return db
      .query("")
      .then(({ rows }) => { return rows[0] })
  }
  return db
    .query(format(`INSERT INTO favourites(guest_id, property_id) VALUES (%L) RETURNING *`, [guest_id, id]))
    .then(({ rows }) => {
      return rows.length === 0 ? undefined : rows[0]  
    })
};

exports.removeFavourite = (id) => {
  console.log(`deleting favourite ${id}`)
  return db
  .query(format(`DELETE FROM favourites WHERE favourite_id = (%L) RETURNING *`, [id]))
  .then(({rows}) => {
    if(rows.length === 0) {
      return rows = undefined
    } else {
      return rows[0]
    }
  })
};

exports.fetchPropertyById = (id) => {
  return db
  .query(format(`SELECT properties.property_id, 
                        properties.name AS property_name, 
                        location, 
                        price_per_night, 
                        description, 
                        CONCAT(first_name, ' ', surname) AS host,
                        avatar AS host_avatar
                    FROM properties
                      JOIN users
                        ON properties.host_id = users.user_id
                      JOIN favourites
                        ON properties.property_id = favourites.property_id
                    WHERE properties.property_id = (%L)`, [id]))
  .then(({rows}) => {return rows[0]})
}
