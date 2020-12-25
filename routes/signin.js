const passport = require('passport');
const express = require('express');
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

router.get("/", (req, res, next) => {
  res.render('signin', { title: "Sign in Page", isLoggedIn: req.isAuthenticated(),  message: req.flash()["error"] });
});

router.post("/", passport.authenticate('local-strategy', {successRedirect: '/',
                                                          failureRedirect: '/accounts/signin',
                                                          failureFlash: true
}));

module.exports = router;