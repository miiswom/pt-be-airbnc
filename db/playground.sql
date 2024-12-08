\c airbnc_test

-- SELECT  review_id,
--         comment,
--         rating,
--         reviews.created_at,
--         CONCAT(first_name, ' ', surname) AS guest,
--         avatar AS guest_avatar
--     FROM reviews
--       JOIN users
--         ON reviews.guest_id = users.user_id;

SELECT * FROM users;
