const express = require("express");
const { getProperties, getPropertyById, postNewFavourite, deleteFavourite, getPropertyReview, postNewReview, deleteReview} = require("./controllers");
const { handleNotFound, handleBadRequest, handleMethodNotAllowed } = require("./errors")
const app = express();

app.use(express.json());

app.get("/api/properties", getProperties, handleNotFound);
app.get("/api/properties/:id", getPropertyById, handleNotFound)
app.post("/api/properties/:id/favourite", postNewFavourite, handleNotFound);
app.get("/api/properties/:id/reviews", getPropertyReview, handleNotFound);
app.post("/api/properties/:id/reviews", postNewReview, handleNotFound);

app.delete("/api/favourite/:id", deleteFavourite, handleNotFound);

app.delete("/api/reviews/:id", deleteReview, handleNotFound);
app.all("/api/reviews/:id", handleMethodNotAllowed)


app.delete("/api/properties/(*)?", handleMethodNotAllowed);
app.patch("/api/properties/(*)?", handleMethodNotAllowed);
app.all("*", handleBadRequest);
app.all("/api/(*)?", handleMethodNotAllowed);


module.exports = app;