\c airbnc 

SELECT properties.property_id,
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
                    JOIN favourites
                    ON properties.property_id = favourites.property_id
                    GROUP BY (properties.property_id, host, images, properties.name);

-- SELECT * FROM favourites;
                    
                    -- query for host
-- SELECT user_id,
--       first_name,
--       surname,
--       email, 
--       password_hash,
--       phone_number,
--       avatar,
--       role,
--       properties.property_id
--   FROM users 
--   JOIN properties
--   ON users.user_id = properties.host_id
--    WHERE users.user_id = 1
--   GROUP BY (user_id, properties.property_id);

-- fetch users (guest) bookings ---> /api/users/:id/bookings
-- SELECT * FROM bookings WHERE guest_id = 2;

-- fetch users (guest) reviews ---> /api/users/:id/reviews
-- SELECT * FROM reviews WHERE guest_id = 2;

-- fetch users (host) properties ---> /api/users/:id/properties
-- SELECT * FROM properties WHERE host_id = 1;
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

-- SELECT * FROM favourites;
-- SHOW timezone;
-- SET SESSION timezone TO 'Etc/GMT';
--SHOW timezone;

-- bookings :         booking_id | property_id | check_in_date | check_out_date |  guest_id | created_at
-- user's bookings :  booking_id | property_id | check_in_date | check_out_date |   host*   |  property_name* | image*

-- INSERT....qc
-- ON CONFLICT DO NOTHING
      
-- SELECT * FROM bookings WHERE guest_id = 2;