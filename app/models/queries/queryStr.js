exports.selectPropertiesQuery = (maxprice, minprice, sort, order, host) => {
  const values = [];
  const queries = [];
  let queriesCount = 0;
  let defineOrder = "";

  let selectProperties = `SELECT properties.property_id,
                          properties.name AS property_name,
                          location,
                          price_per_night,
                          CONCAT(first_name, ' ', surname) AS host,
                        ARRAY(SELECT image_url FROM images WHERE property_id = properties.property_id) AS images,
                          properties.property_type AS property_type
                    FROM properties
                    JOIN users
                    ON properties.host_id = users.user_id
                    JOIN images
                    ON properties.property_id = images.property_id
                    GROUP BY (properties.property_id, host, images, properties.name)`

  if (maxprice) {
    values.push(maxprice);
    queriesCount++;
    queries.push(` WHERE price_per_night < $${queriesCount}`)
  };

  if (minprice) {
    values.push(minprice);
    queriesCount++;
    queries.push(` WHERE price_per_night > $${queriesCount}`)
  };

  if (sort === 'popularity' || !sort) {
    queries.push(` ORDER BY properties.property_id`)
  };

  if (sort && sort !== "popularity") {
    queries.push(` ORDER BY ${sort}`)
  };

  if (order === 'ascending' || !order) {
      defineOrder += ` ASC;`;
    };

  if (order === 'descending') {
      defineOrder += ` DESC;`;
    };

    selectProperties += queries.join("")
    return { selectProperties, defineOrder, values}
};

exports.insertFavouritesQuery = (id, guest_id) => {
  let insertFavourites = `INSERT INTO favourites(guest_id, property_id) VALUES ($1, $2) RETURNING *`
  const values = [];

  if (id) {
    values.push(id);
  }
  if (guest_id) {
    values.push(guest_id)
  }

  return {insertFavourites, values}
};

exports.selectPropertyByIdQuery = () => {
let selectPropertyById =  `SELECT properties.property_id, 
                        properties.name AS property_name, 
                        location, 
                        price_per_night, 
                        description, 
                        CONCAT(first_name, ' ', surname) AS host,
                        avatar AS host_avatar,
                        (SELECT COALESCE((SELECT COUNT(*) 
                          FROM properties
                          JOIN favourites
                          ON properties.property_id = favourites.property_id
                          WHERE properties.property_id = $1
                          GROUP BY  properties.property_id, favourites.property_id), 0) AS favourite_count),
                        ARRAY(SELECT image_url FROM images WHERE property_id = $1) AS images
                    FROM properties
                      JOIN users
                        ON properties.host_id = users.user_id
                     JOIN images
                        ON properties.property_id = images.property_id
                    WHERE properties.property_id = $1
                    GROUP BY properties.property_id, users.first_name, users.surname, host_avatar;`;
return { selectPropertyById }
};

exports.selectReviewsByIdQuery = () => {
  let selectReviewsById = `SELECT review_id,
                          comment,
                          rating,
                          reviews.created_at,
                          users.user_id,
                          CONCAT(first_name, ' ', surname) AS guest,
                          avatar AS guest_avatar
                      FROM reviews
                        JOIN users
                          ON reviews.guest_id = users.user_id
                      WHERE property_id = $1`
  return {selectReviewsById}
};

exports.insertReviewQuery = () => {
  let insertReview = `INSERT INTO reviews( property_id,
      guest_id,
      rating,
      comment) VALUES ($1, $2, $3, $4) RETURNING *`;

  return { insertReview }
};

exports.selectUserByIdQuery = () => {
  let selectUserById = `SELECT user_id,
                          first_name,
                          surname,
                          email, 
                          password_hash,
                          phone_number,
                          avatar,
                          role, 
                          created_at
                      FROM users WHERE user_id = $1 `;
  return { selectUserById }
};

exports.patchUserByIdQuery = (id, first_name, surname, email, phone_number, avatar) => {
  const values = [];
  const updateSets = []
  let valuesCount = 0;
  let updateUserById = `UPDATE users SET`;
  if (id) {
    values.push(id);
    valuesCount++
  }
  if (first_name) {
    values.push(first_name);
    valuesCount++;
    updateSets.push(` first_name= $${valuesCount}`);
  };

  if (surname) {
    values.push(surname);
    valuesCount++
    updateSets.push(` surname= $${valuesCount}`);
  };

  if (email) {
    values.push(email);
    valuesCount++
    updateSets.push(` email= $${valuesCount}`);
  };

  // if (password_hash) {
  //   values.push(password_hash);
  //   valuesCount++
  //   updateSets.push(` password_hash = $${valuesCount}`);
  // };

  if (phone_number) {
    values.push(phone_number);
    valuesCount++
    updateSets.push(` phone_number= $${valuesCount}`);
  };

  if (avatar) {
    values.push(avatar);
    valuesCount++
    updateSets.push(`avatar= $${valuesCount}`);
  };

  updateUserById += updateSets.join(",") 
  updateUserById += ` WHERE user_id= $1 RETURNING user_id, first_name, surname, email, phone_number AS phone, avatar, created_at;`
  return { updateUserById, values }
};

exports.insertBookingQuery = () => {
  const insertBooking = `INSERT INTO bookings(property_id,
                                              guest_id, 
                                              check_in_date,
                                              check_out_date)
                            VALUES ($1, $2, $3, $4) RETURNING *;`
    return { insertBooking }
};

exports.updateBookingByIdQuery = () => {
    let updateBookingById = `UPDATE bookings 
    SET check_in_date = $1, check_out_date = $2
    WHERE property_id = $3
    AND NOT EXISTS ( SELECT * FROM bookings
    WHERE property_id = $3
    AND check_in_date < $2 AND check_out_date > $1 ) RETURNING *;`;
    return {updateBookingById}
};

exports.selectUsersBookingByIdQuery = () => {
  const selectUsersBookingById = `SELECT  bookings.booking_id,
                                          bookings.property_id,
                                          bookings.check_in_date,
                                          bookings.check_out_date,
                                          CONCAT(users.first_name, ' ', users.surname) AS host,
                                          properties.name AS property_name,
                                          images.image_url AS image
                                    FROM bookings
                                    JOIN users
                                    ON bookings.guest_id = users.user_id
                                    JOIN properties
                                    ON bookings.property_id = properties.property_id
                                    JOIN images
                                    ON properties.property_id = images.property_id
                                  WHERE properties.property_id = $1;`;

  return { selectUsersBookingById}
}

exports.selectUserByCredentialsQuery = () => {
  const selectUserByCredentials = `SELECT user_id,
                          first_name,
                          surname,
                          email, 
                          phone_number,
                          password_hash,
                          avatar FROM users WHERE email = $1;`
  return {selectUserByCredentials}
};

exports.createUserQuery = () => {
  const createUser = `INSERT INTO users( 
      first_name, 
      surname, 
      email, 
      phone_number, 
      role, 
      avatar, 
      password_hash) VALUES ($1, $2, $3, $4, $5, $6, crypt($7, gen_salt('bf', 10))) RETURNING *;`

      return { createUser }
};

exports.selectUserReviewsQuery = () => {
  const selectUserReviews = `SELECT * FROM reviews WHERE guest_id = $1;`

  return { selectUserReviews }
};

exports.selectUserPropertiesQuery = () => {
  const selectUserProperties = `SELECT * FROM properties WHERE host_id = $1;`

  return { selectUserProperties }
}

