const express = require('express');
const { authenticate } = require("./passport");
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

router.get('/', function(req, res, next) {
  res.render('signin', { title: "Sign in Page" ,message: req.flash("message"),isLoggedIn: req.isAuthenticated()});
});

router.post("/", authenticate());

module.exports = router;