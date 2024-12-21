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

SELECT  bookings.booking_id,
        bookings.property_id,
        bookings.check_in_date,
        bookings.check_out_date,
        CONCAT(users.first_name, ' ', users.surname) AS host,
        properties.name AS property_name,
        images.image_url
  FROM bookings
  JOIN users
   ON bookings.guest_id = users.user_id
  JOIN properties
   ON bookings.property_id = properties.property_id
  JOIN images
   ON properties.property_id = images.property_id
WHERE users.user_id = 2;


-- SHOW timezone;
-- SET SESSION timezone TO 'Etc/GMT';
--SHOW timezone;

-- bookings :         booking_id | property_id | check_in_date | check_out_date |  guest_id | created_at
-- user's bookings :  booking_id | property_id | check_in_date | check_out_date |   host*   |  property_name* | image*

-- INSERT....qc
-- ON CONFLICT DO NOTHING
      
-- SELECT * FROM bookings WHERE guest_id = 2;