const express = require("express");
const { getProperties, getPropertyById, postNewFavourite, deleteFavourite, getPropertyReview, postNewReview, deleteReview, getUserById, patchUser} = require("./controllers");
const { handleNotFound, handleBadRequest, handleMethodNotAllowed, handleInvalidEndpoint } = require("./errors")
const app = express();

app.use(express.json());

// properties router //
app.get("/api/properties", getProperties);
app.get("/api/properties/:id", getPropertyById)
app.post("/api/properties/:id/favourite", postNewFavourite);
app.get("/api/properties/:id/reviews",getPropertyReview);
app.post("/api/properties/:id/reviews", postNewReview);
app.all("/api/properties/?(*)?", handleMethodNotAllowed);

// favourite router //
app.delete("/api/favourite/:id", deleteFavourite);

// review router //
app.delete("/api/reviews/:id", deleteReview);
app.all("/api/reviews/:id", handleMethodNotAllowed)

// users router //
app.get('/api/users/:id', getUserById)
app.patch('/api/users/:id', patchUser)
app.all('/api/users/:id', handleMethodNotAllowed)


// invalid enpoint //
app.all("*", handleInvalidEndpoint);

// error middleware //
app.use("*", handleBadRequest, handleNotFound )


// app.use("/api/properties", handleMethodNotAllowed);


module.exports = app;