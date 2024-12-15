const express = require("express");
const { handleNotFound, handleBadRequest, handleInvalidEndpoint } = require("./controllers/errors/handlingErrors")
const app = express();
const apiRouter  = require("./routers/api.router");

app.use(express.json());
app.use("/api", apiRouter);

// invalid enpoint //
app.all("*", handleInvalidEndpoint);

// error middleware //
app.use("*", handleBadRequest, handleNotFound )

module.exports = app;