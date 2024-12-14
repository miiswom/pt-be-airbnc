const { createUsers, createProperties, createReviews, createPropertyTypes, createFavourites, createImages } = require("./utils/createTables");
const { insertUser, insertPropertyTypes, insertProperties, insertReviews, insertFavourites, insertImages} = require("./utils/insertData")

exports.seed = async () => {
  await createUsers();
  await createProperties();
  await Promise.all([createPropertyTypes(), createFavourites()])
  await createReviews()
  await insertUser()
  await insertProperties();
  await Promise.all([insertPropertyTypes(), insertFavourites()])
  await insertReviews()
  await createImages()
  await insertImages()
};