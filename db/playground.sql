\c airbnc_test

-- UPDATE bookings 
--     SET check_in_date = '2025-01-01', check_out_date = '2025-01-06'
--     WHERE property_id = 1
--     AND NOT EXISTS ( SELECT * FROM bookings
--     WHERE property_id = 1
--     AND check_in_date < '2025-01-06' AND check_out_date > '2025-01-01' ) RETURNING *;

-- UPDATE bookings 
--     SET check_in_date = '2025-01-01', check_out_date = '2025-01-06'
--     WHERE property_id = 1
--     AND NOT EXISTS ( SELECT * FROM bookings
--     WHERE property_id = 1
--     AND check_in_date < '2025-01-06' AND check_out_date > '2025-01-01' ) RETURNING *;

SELECT  favourites.property_id,
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
                      ON properties.property_id = images.property_id
                    GROUP BY property_name, properties.name, properties.property_id, favourites.favourite_id, users.first_name, users.surname, images.image_url;

-- SELECT * FROM favourites;
-- SHOW timezone;
-- SET SESSION timezone TO 'Etc/GMT';
--SHOW timezone;

-- bookings :         booking_id | property_id | check_in_date | check_out_date |  guest_id | created_at
-- user's bookings :  booking_id | property_id | check_in_date | check_out_date |   host*   |  property_name* | image*

-- INSERT....qc
-- ON CONFLICT DO NOTHING
      
-- SELECT * FROM bookings WHERE guest_id = 2;