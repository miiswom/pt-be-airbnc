const express = require("express");
const { getProperties } = require("./controllers");
const { handleInvalid } = require("./errors")

const app = express();


app.get("/api/properties", getProperties);

app.all("*", handleInvalid);

// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).send({err})
// })

module.exports = app;