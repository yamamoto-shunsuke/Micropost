const passport = require('passport');
const express = require('express');
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);


router.get('/:user_id', function (req, res, next) {
  knex('microposts')
    .where({ user_id: req.params.user_id })
    .then(function (rows) {
      const content = rows;
      res.render('profile', { isLoggedIn: req.isAuthenticated(), user_id: req.user.id, user_name: req.user.name, contentList: content });
    })
  });

  router.post('/', function (req, res, next) {

  })

  module.exports = router;
