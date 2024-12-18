const db = require("../../db/connection");
const { selectPropertiesQuery, selectPropertyByIdQuery, selectReviewsByIdQuery, insertBookingQuery} = require("./queries/queryStr")

// properties 
exports.fetchProperties = async (maxprice, minprice, sort, order, host) => {
  const {selectProperties, defineOrder, values} = selectPropertiesQuery(maxprice, minprice, sort, order, host);

  return db.query(selectProperties + defineOrder, values).then(({ rows }) => {
    if (rows.length === 0 || !rows) {
      return Promise.reject({ status: 404 });
    } else {
      return rows
    }
  }).catch((err) => {
    return Promise.reject(err)
  })
};

exports.fetchPropertyById = async (id) => {
  const { selectPropertyById } = selectPropertyByIdQuery();
  
  return db.query(selectPropertyById, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404 })
      } else {
        return rows[0]
      }
    }).catch((err) => {
      return Promise.reject(err)
    })
};

exports.fetchPropertyReviews = (id) => {
  const { selectReviewsById } = selectReviewsByIdQuery()
  
  return db.query(selectReviewsById, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404 })
      } else {
        return rows
      }
    }).catch((err) => {
      return Promise.reject(err)
    })
};

exports.calcAverageRating = async (obj) => {
  let total = 0;
  let average_rating = 0;

  for (const keys in obj) {
    total += obj[keys].rating;
  }
  average_rating = total / obj.length
  return average_rating;
};

// bookings 

exports.fetchPropertyBookings = (id) => {
  return db.query(`SELECT property_id,
                          booking_id,
                          DATE_FORMAT(check_in_date, 'YYYY-MM-DD'),
                          check_out_date,
                          created_at
                    FROM bookings
                    WHERE property_id = $1;`, [id])
            .then(({rows}) => { 
              if(rows.length === 0) {
                return Promise.reject({status: 404})
              } else {
                return { bookings: [{booking_id: rows[0].booking_id, 
                                    check_in_date: rows[0].check_in_date,
                                    check_out_date: rows[0].check_out_date,
                                    created_at: rows[0].created_at}], 
                        property_id: rows[0].property_id }
              } })
};

exports.addPropertyBooking = (id, guest_id, check_in_date, check_out_date) => {
  const { insertBooking } = insertBookingQuery()
  return db.query(insertBooking, [id, guest_id, check_in_date, check_out_date])
            .then(({rows}) => { 

              return rows[0].booking_id})
}