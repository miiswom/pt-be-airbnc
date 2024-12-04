const express = require("express");
const { getProperties } = require("./controllers");
const { handleBadRequest, handleMethodNotAllowed } = require("./errors")

const app = express();


app.get("/api/properties", getProperties);
app.delete("/api/properties", handleMethodNotAllowed);
app.all("*", handleBadRequest);

// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).send({err})
// })

module.exports = app;