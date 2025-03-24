\c airbnc
 SELECT * FROM users;

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