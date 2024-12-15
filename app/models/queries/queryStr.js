exports.selectPropertiesQuery = (maxprice, minprice, sort, order, host) => {
  const values = [];
  const queries = [];
  let queriesCount = 0;
  let defineOrder = "";

  let selectProperties = `SELECT  favourites.property_id,
                          properties.name AS property_name,
                          location,
                          price_per_night,
                          CONCAT(first_name, ' ', surname) AS host,
                          image_url AS image
                    FROM properties
                    JOIN users
                    ON properties.host_id = users.user_id
                    JOIN favourites
                    ON properties.property_id = favourites.property_id
                    JOIN images
                    ON properties.property_id = images.property_id`

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
    queries.push(` ORDER BY favourites.property_id`)
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
                        COUNT(favourites.property_id) AS favourite_count,
                        ARRAY(SELECT image_url FROM images WHERE property_id = $1) AS images
                    FROM properties
                      JOIN users
                        ON properties.host_id = users.user_id
                      JOIN favourites
                        ON properties.property_id = favourites.property_id
                      JOIN images
                        ON properties.property_id = images.property_id
                    WHERE properties.property_id = $1
                    GROUP BY properties.property_id, users.first_name, users.surname, users.avatar, image_url`;
return { selectPropertyById }
};

exports.selectReviewsByIdQuery = () => {
  let selectReviewsById = `SELECT review_id,
                          comment,
                          rating,
                          reviews.created_at,
                          CONCAT(first_name, ' ', surname) AS guest,
                          avatar AS guest_avatar
                      FROM reviews
                        JOIN users
                          ON reviews.guest_id = users.user_id
                      WHERE review_id = $1`
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
                          phone_number,
                          avatar, 
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
}
