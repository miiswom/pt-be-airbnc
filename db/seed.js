const { createExtensions, createUsers, createProperties, createReviews, createPropertyTypes, createFavourites, createImages, createBookings } = require("./utils/createTables");
const { insertUser, insertPropertyTypes, insertProperties, insertReviews, insertFavourites, insertImages, insertBookings} = require("./utils/insertData")

exports.seed = async () => {
  await createExtensions()
  await createUsers();
  await createProperties();
  await createPropertyTypes();
  await createFavourites();
  await createReviews()
  await insertUser()
  await insertProperties();
  await insertPropertyTypes();
  await insertFavourites();
  await insertReviews();
  await createImages();
  await createBookings();
  await insertImages();
  await insertBookings();
};