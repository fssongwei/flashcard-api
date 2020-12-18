const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const fs = require("fs");

var opts = {};
opts.jwtFromRequest = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};
let pubKey = fs.readFileSync("./keys/pub.key");
opts.secretOrKey = pubKey;

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    done(null, jwt_payload.data);
  })
);
