const db = require("../../../db/connection")
const {fetchUserById} = require("../../models/users.models")
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
const passport = require("passport")
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.TOKEN_SECRET;


exports.jwt_strategy = passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  console.log(jwt_payload.id)
  const id = jwt_payload.id
  fetchUserById(id).then((user) => {
        if (!user) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    })
  }));

  // app.get("/api/protected", passport.authenticate('jwt', {
  //   session: false
  // }), (req, res, next) => {
  //   return res.status(200)
  // .json({
  //   success: true,
  //   user: req.user
  // })})