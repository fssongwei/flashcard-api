const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.get(
  "/auth/google",
  passport.authenticate("google", { session: false, scope: ["profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // generate a JWT token
    let token = jwt.sign(
      {
        data: req.user,
      },
      process.env.JWT_SECRET,
      { expiresIn: 604800 }
    );
    res.cookie("jwt", token);
    res.redirect("/");
  }
);

router.get(
  "/auth/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).send(req.user);
  }
);

router.get("/auth/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});

module.exports = router;
