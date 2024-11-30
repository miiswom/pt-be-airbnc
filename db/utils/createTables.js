
const db = require("../connection");

exports.createUsers = async() => {
  await db.query(`DROP TABLE IF EXISTS users CASCADE;`);
  await db.query(`CREATE TABLE users ( 
                    user_id SERIAL PRIMARY KEY,
                      first_name VARCHAR NOT NULL,
                      surname VARCHAR NOT NULL,
                      email VARCHAR NOT NULL,
                      phone_number VARCHAR,
                      role VARCHAR,
                      CONSTRAINT chk_role CHECK (role IN ('host', 'guest')),
                      avatar VARCHAR,
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
                    created_at text DEFAULT TO_CHAR(CURRENT_TIMESTAMP,'DD/MM/YYYY - HH24:MI:SS'));`) // limit to 5 starts
                    
};

exports.createFavourites = async() => {
  await db.query(`DROP TABLE IF EXISTS favourites CASCADE;`);
  await db.query(`CREATE TABLE favourites(
                    favourite_id SERIAL PRIMARY KEY,
                    guest_id INTEGER NOT NULL REFERENCES users(user_id),
                    property_id INTEGER NOT NULL REFERENCES properties(property_id) );`)
}

