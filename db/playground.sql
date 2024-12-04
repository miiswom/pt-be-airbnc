\c airbnc_test

SELECT  properties.property_id, 
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
    ON properties.property_id = favourites.property_id;

-- SELECT  * FROM reviews;
-- INNER JOIN properties
--   ON users.user_id = properties.host_id 

-- ["property_id", "property_name", "location", "price_per_night", "host"]
 
SELECT
  guest_id,
  COUNT (guest_id)
FROM
  favourites
GROUP BY
guest_id;

SELECT * FROM favourites ORDER BY guest_id;