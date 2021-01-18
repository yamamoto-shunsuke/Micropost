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

  //if文で、パスワードが誤っていた場合、誤っていなければ、名前もしくはメアドが既にあった時となかった時で分岐。
  if (password !== confirm) {
    console.log("パスワードミス");
    res.render('signup', { title: "Sign up", isLoggedIn: req.isAuthenticated(), message: "The user name or password is incorrect." });
  } else {
    await knex('users')
      .where({ name: username })
      .orWhere({ email: email })
      .then(async function (rows) {
            if (rows.length !== 0) {
              res.render('signup', { title: "Sign up", isLoggedIn: req.isAuthenticated(), message: "Your username or email address is already registered." });
            } else {
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
            }
          })
          .catch(function (error) {
            console.error(error);
          });
  }
});

module.exports = router;