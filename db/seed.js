const {createUsers, createProperties, createReviews, createPropertyTypes, createFavourites} = require("./utils/createTables");
const { insertUser, insertPropertyTypes, insertProperties, insertReviews, insertFavourites} = require("./utils/insertData")

exports.seed = async () => {
  await createUsers();
  await createPropertyTypes()
  await createProperties();
  await createReviews();
  await createFavourites();
  await insertUser()
  await insertPropertyTypes();
  await insertProperties();
  await insertReviews();
  await insertFavourites()
};