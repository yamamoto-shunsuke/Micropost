const express = require('express');
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);
const relationships = require('../models/relationships');

router.use('/accounts/signup', require('./signup'));
router.use('/accounts/signin', require('./signin'));
router.use('/logout', require('./logout'));
router.use('/accounts/edit', require('./edit'));
router.use('/users', require('./users'));
router.use('/users', require('./profile'));
router.use('/delete', require('./delete'));
router.use('/users', require('./followers'));
router.use('/users', require('./following'));

/* GET home page. */
router.get('/', async function (req, res, next) {

  if (req.isAuthenticated()) {
    const user_id = req.user.id;
    const user_name = req.user.name;

    following_id = await relationships.followers_count(user_id);

    followed_id = await relationships.following_count(user_id);

    knex('microposts')
      .where('user_id', req.user.id)
      .then(function (rows) {
        res.render('index', { title: "Profile App", isLoggedIn: req.isAuthenticated(), user_id: user_id, user_name: user_name, contentList: rows, microposts: rows.length, followed_id: followed_id.length, follower_id: following_id.length});
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    res.render('index', { title: "Welcome to the MicroPost App", isLoggedIn: req.isAuthenticated(), user_name: false});
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

module.exports = router;
