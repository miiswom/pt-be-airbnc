const express = require("express");
const path = require("path")
const { handleNotFound, handleBadRequest, handleInvalidEndpoint } = require("./controllers/errors/handlingErrors")
const app = express();
const apiRouter  = require("./routers/api.router");

app.use(express.json());
app.use("/index", express.static(path.join(__dirname, 'public')))

app.use("/api", apiRouter);

// invalid enpoint //
app.all("*", handleInvalidEndpoint);

// error middleware //
app.use("*", handleBadRequest, handleNotFound )

module.exports = app;