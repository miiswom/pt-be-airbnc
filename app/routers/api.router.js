const express = require("express");
const apiRouter = express.Router();
const propertiesRouter = require("./properties.router");
const favouriteRouter = require("./favourite.router");
const reviewsRouter = require("../routers/reviews.router");
const usersRouter = require("./users.router")
const bookingsRouter = require("./bookings.router")
const signinRouter = require("./signin.router");
const singupRouter = require("./signup.router");
const signoutRouter = require("./signout.router")
 
apiRouter.use("/signin", signinRouter)
apiRouter.use("/signup", singupRouter)
apiRouter.use("/signout", signoutRouter)
apiRouter.use("/properties", propertiesRouter)
apiRouter.use("/favourite", favouriteRouter)
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/users", usersRouter)
apiRouter.use("/bookings", bookingsRouter)


module.exports = apiRouter;
