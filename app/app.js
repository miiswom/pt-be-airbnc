const express = require("express");
const { getProperties } = require("./controllers");
const { handleInvalid } = require("./errors")

const app = express();


app.get("/api/properties", getProperties);

app.all("*", handleInvalid)

module.exports = app;