const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

router.get('/', function (req, res, next) {
  res.render('signup', { title: "Sign up", isLoggedIn: req.isAuthenticated(), message: null });
});


router.post("/", async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirm = req.body.confirm;

  if (password !== confirm) {
    res.render('signup', { title: "Sign up", isLoggedIn: req.isAuthenticated(), message: "The user name or password is incorrect." });
    return;
  }

  knex('users')
    .where({ name: username })
    .then(function (rows) {
      if (rows.length !== 0) {
        res.render('signup', { title: "Sign up", isLoggedIn: req.isAuthenticated(), message: "Your username or email address is already registered." });
        return;
      }
    });

  knex('users')
    .where({ email: email })
    .then(function (rows) {
      if (rows.length !== 0) {
        res.render('signup', { title: "Sign up", isLoggedIn: req.isAuthenticated(), message: "Your username or email address is already registered." });
        return;
      }
    });

  const hashedPassword = await bcrypt.hash(password, 10);
  knex
    .insert({ name: username, email: email, password: hashedPassword })
    .into('users')
    .then(function (rows) {
      res.redirect('/');
    })
    .catch(function (error) {
      console.log(error);
    });

});

module.exports = router;