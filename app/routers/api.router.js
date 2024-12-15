const express = require("express");
const apiRouter = express.Router();
const propertiesRouter = require("./properties.router");
const favouriteRouter = require("./favourite.router");
const reviewsRouter = require("../routers/reviews.router");
const usersRouter = require("./users.router")
 


apiRouter.use("/properties", propertiesRouter)
apiRouter.use("/favourite", favouriteRouter)
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/users", usersRouter)


module.exports = apiRouter;