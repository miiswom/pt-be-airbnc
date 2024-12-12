\c airbnc_test

SELECT * FROM users SET first_name= '$1' WHERE user_id= 2 RETURNING *
-- SELECT * FROM users;
