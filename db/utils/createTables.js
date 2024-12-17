
const db = require("../connection");

exports.createUsers = async() => {
  await db.query(`DROP TABLE IF EXISTS users CASCADE;`);
  await db.query(`CREATE TABLE users ( user_id SERIAL PRIMARY KEY,
                      first_name VARCHAR NOT NULL,
                        CONSTRAINT ch_first_name CHECK(REGEXP_LIKE(first_name, '[a-zA-Z]')),
                      surname VARCHAR NOT NULL,
                        CONSTRAINT ch_surname CHECK(REGEXP_LIKE(surname, '[a-zA-Z]')),
                      email VARCHAR NOT NULL,
                        CONSTRAINT ch_email CHECK(REGEXP_LIKE(email, '^[a-zA-Z._0-9-]+@[a-z]+.(co(m|.uk)|net|fr)$')),
                      phone_number VARCHAR,
                        CONSTRAINT ch_phone_number CHECK(REGEXP_LIKE(phone_number, '[0-9]')),
                      role VARCHAR,
                        CONSTRAINT chk_role CHECK (role IN ('host', 'guest')),
                      avatar VARCHAR,                        
                        CONSTRAINT ch_avatar CHECK(REGEXP_LIKE(avatar, '^(http(s)?:\/\/(www.)?)?[-_.a-z0-9\/]+.(jpeg|png|jpg)$')),
                      created_at text DEFAULT TO_CHAR(CURRENT_TIMESTAMP,'DD/MM/YYYY - HH24:MI:SS') ) ;`)
};

exports.createPropertyTypes = async () => {
  await db.query(`DROP TABLE IF EXISTS property_types CASCADE;`)
  await db.query(`CREATE TABLE property_types (
                    property_type VARCHAR PRIMARY KEY,
                      description text) ;`)
};

exports.createProperties = async() => {
  await db.query(`DROP TABLE IF EXISTS properties CASCADE;`);
  await db.query(`CREATE TABLE properties (
                    property_id SERIAL PRIMARY KEY,
                      host_id INTEGER REFERENCES users(user_id),
                      name VARCHAR NOT NULL,
                      location VARCHAR NOT NULL,
                      property_type VARCHAR NOT NULL,
                      price_per_night DECIMAL NOT NULL,
                      description text );`)
};

exports.createReviews = async() => {
  await db.query(`DROP TABLE IF EXISTS reviews CASCADE;`);
  await db.query(`CREATE TABLE reviews (
                    review_id SERIAL PRIMARY KEY,
                    property_id INTEGER NOT NULL REFERENCES properties(property_id),
                    guest_id INTEGER NOT NULL REFERENCES users(user_id),
                    rating INTEGER NOT NULL,
                    comment text,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`) // limit to 5 starts
                    
};

exports.createFavourites = async() => {
  await db.query(`DROP TABLE IF EXISTS favourites CASCADE;`);
  await db.query(`CREATE TABLE favourites(
                    favourite_id SERIAL PRIMARY KEY,
                    guest_id INTEGER NOT NULL REFERENCES users(user_id),
                    property_id INTEGER NOT NULL REFERENCES properties(property_id) );`)
};

exports.createImages = async() => {
  await db.query(`DROP TABLE IF EXISTS images CASCADE;`)
  await db.query(`CREATE TABLE images(  image_id SERIAL PRIMARY KEY,
                                        property_id INT REFERENCES properties(property_id) NOT NULL,
                                        image_url VARCHAR NOT NULL,
                                        alt_text VARCHAR NOT NULL);`)
};

exports.createBookings = async() => {
  await db.query(`DROP TABLE IF EXISTS bookings;`);
  await db.query(`CREATE TABLE bookings(  booking_id SERIAL PRIMARY KEY,
                                          property_id INT NOT NULL REFERENCES properties(property_id),
                                          guest_id INT NOT NULL REFERENCES users(user_id),
                                          check_in_date DATE NOT NULL,
                                          check_out_date DATE NOT NULL,
                                          created_at text DEFAULT TO_CHAR(CURRENT_TIMESTAMP,'DD/MM/YYYY - HH24:MI:SS'));`)

}

