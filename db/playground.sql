\c airbnc_test

-- SELECT properties.property_id,
--         properties.name AS property_name,
--         location,
--         price_per_night,
--         CONCAT(first_name, ' ', surname) AS host
--     FROM properties
--     JOIN users
--     ON properties.host_id = users.user_id
--     JOIN favourites
--     ON properties.property_id = favourites.property_id
--     WHERE price_per_night < 100
--     ORDER BY favourites.guest_id ASC;

-- SELECT properties.property_id AS prop_id, favourites.property_id AS fav_prop_id, guest_id
-- FROM favourites
-- JOIN properties
-- ON favourites.property_id = properties.property_id
-- ORDER BY guest_id ASC;

SELECT  * FROM reviews;
-- INNER JOIN properties
--   ON users.user_id = properties.host_id 

-- ["property_id", "property_name", "location", "price_per_night", "host"]