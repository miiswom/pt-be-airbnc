const express = require("express");
const apiRouter = express.Router();
const propertiesRouter = require("./properties.router");
const favouriteRouter = require("./favourite.router");
const reviewsRouter = require("../routers/reviews.router");
const usersRouter = require("./users.router")
const bookingsRouter = require("./bookings.router")
const siginRouter = require("./signin.router");
const singupRouter = require("./signup.router");
 
apiRouter.use("/properties", propertiesRouter)
apiRouter.use("/favourite", favouriteRouter)
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/users", usersRouter)
apiRouter.use("/bookings", bookingsRouter)
apiRouter.use("/signin", siginRouter)
apiRouter.use("/signup", singupRouter)

module.exports = apiRouter;
