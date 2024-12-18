\c airbnc_test

UPDATE bookings SET check_in_date = '2025-01-01', 
                    check_out_date = '2025-01-06'
WHERE booking_id = 1 RETURNING *;

-- SHOW timezone;
-- SET SESSION timezone TO 'Etc/GMT';
SHOW timezone;


-- INSERT....qc
-- ON CONFLICT DO NOTHING
      
