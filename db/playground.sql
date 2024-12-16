\c airbnc_test

SELECT  booking_id,
        check_in_date,
        check_out_date,
        created_at
FROM bookings
WHERE property_id = $1;

SELECT * FROM bookings;

-- INSERT....qc
-- ON CONFLICT DO NOTHING
      
