\c airbnc_test

SELECT favourites.property_id,
        properties.name AS property_name,
        location,
        price_per_night,
        CONCAT(first_name, ' ', surname) AS host
  FROM properties
  JOIN users
  ON properties.host_id = users.user_id
  JOIN favourites
  ON properties.property_id = favourites.property_id
  ORDER BY favourites.property_id ASC;

-- SELECT  * FROM reviews;
-- INNER JOIN properties
--   ON users.user_id = properties.host_id 

-- ["property_id", "property_name", "location", "price_per_night", "host"]