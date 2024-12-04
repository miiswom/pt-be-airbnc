const express = require("express");
const { getProperties, getPropertyById, postNewFavourite, deleteFavourite} = require("./controllers");
const { handleNotFound, handleBadRequest, handleMethodNotAllowed } = require("./errors")
const app = express();

app.use(express.json());

app.get("/api/properties", getProperties, handleNotFound);
app.get("/api/properties/:id", getPropertyById)
app.post("/api/properties/:id/favourite", postNewFavourite, handleNotFound);
app.delete("/api/properties/:id/favourite", deleteFavourite, handleNotFound)
app.delete("/api/properties", handleMethodNotAllowed);
app.all("*", handleBadRequest);

module.exports = app;