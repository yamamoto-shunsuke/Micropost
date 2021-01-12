const express = require('express');
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);
const followers = require('../public/javascripts/followers.js');
const following = require('../public/javascripts/following.js');

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
router.get('/',function (req, res, next) {
  let followed_id = 0;

  if (req.isAuthenticated()) {
    console.log(followers(followed_id));

    console.log(following); 

    knex('microposts')
      .where('user_id', req.user.id)
      .then(function (rows) {
        res.render('index', { title: "Profile App", isLoggedIn: req.isAuthenticated(), user_id: req.user.id, user_name: req.user.name, contentList: rows, microposts: rows.length, followed_id: followed_id, follower_id: following_id });
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

module.exports = router;
