const {createUsers, createProperties, createReviews, createPropertyTypes, createFavourites} = require("./utils/createTables");

exports.seed = async () => {
  await createUsers();
  await createPropertyTypes()
  await createProperties();
  await createReviews();
  await createFavourites();
};