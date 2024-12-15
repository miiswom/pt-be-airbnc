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
                    ON properties.property_id = images.property_id`;


module.exports = selectProperties;
