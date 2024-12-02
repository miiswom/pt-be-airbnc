const { createUsers, createProperties, createReviews, createPropertyTypes, createFavourites } = require("./utils/createTables");
const { insertUser, insertPropertyTypes, insertProperties, insertReviews, insertFavourites } = require("./utils/insertData")

exports.seed = async () => {
  await createUsers();
  await createProperties();
  await Promise.all([createPropertyTypes(), createReviews(), createFavourites()])
  await insertUser()
  await insertProperties();
  await Promise.all([insertPropertyTypes(), insertReviews(), insertFavourites()])
};