const express = require('express');
const router = express.Router();
const knexfile = require("../knexfile.js");
const { where } = require('../models/user.js');
const knex = require("knex")(knexfile.development);

router.use('/accounts/signup', require('./signup'));
router.use('/accounts/signin', require('./signin'));

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    knex('microposts')
      .where('user_id', req.user.id)
      .then(function (rows) {
        const content = rows;
        res.render('index', { title: "Profile App", isLoggedIn: req.isAuthenticated(), user_id: req.user.id, user_name: req.user.name, contentList: content });
      });
  } else {
    res.render('index', { title: "Welcome to the MicroPost App", isLoggedIn: req.isAuthenticated(), user_name: req.session.name });
  }
});

router.post("/", (req, res, next) => {
  const user_id = req.user.id;
  const content = req.body.content;
  knex
    .insert({ user_id: user_id, content: content })
    .into('microposts')
    .then(function (rows) {
      res.redirect("/");
    })
    .catch(function (error) {
      console.error(error);
      res.redirect("/");
    });
});

router.post("/delete", (req, res, next) => {

})

module.exports = router;
