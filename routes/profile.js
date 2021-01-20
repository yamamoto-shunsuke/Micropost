const passport = require('passport');
const express = require('express');
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);
const relationships = require('../models/relationships');


router.get('/:user_id', async function (req, res, next) {
  let followed_id = 0;
  let following_id = 0;
  req.session.isfollow = false;
  const user_id = req.params.user_id;

  knex("relationships")
    .where({ followed_id: req.user.id, follower_id: req.params.user_id })
    .then(function (rows) {
      if (rows.length >= 1) {
        req.session.isfollow = true;
      }
    })
    .catch(function (error) {
      console.error(error);
    });

  following_id = await relationships.followers_count(user_id);

  followed_id = await relationships.following_count(user_id);

  microposts = await relationships.micropost_count(user_id);

  if (microposts.length !== 0) {
    res.render("profile", { isLoggedIn: req.isAuthenticated(), user_name: microposts[0].name, contentList: microposts, user_id: microposts[0].id, page_location: req.params.user_id, isotherspage: req.user.id != req.params.user_id, isfollow: req.session.isfollow, microposts: microposts.length, followed_id: following_id.length, follower_id: followed_id.length });
  } else {
    knex
      .from('users')
      .where({ id: req.params.user_id })
      .then(function (rows) {
        res.render("profile", { isLoggedIn: req.isAuthenticated(), user_name: rows[0].name, contentList: null, user_id: rows[0].id, page_location: req.params.user_id, isotherspage: req.user.id != req.params.user_id, isfollow: req.session.isfollow, microposts: rows.length, followed_id: following_id.length, follower_id: followed_id.length });
      })
      .catch(function (error) {
        console.error(error);
      });
  }
})

router.post('/:user_id', function (req, res, next) {
  const followed_id = req.user.id;
  const follower_id = req.params.user_id;

  if (req.session.isfollow) {
    knex("relationships")
      .where({ followed_id: followed_id, follower_id: follower_id })
      .delete()
      .then(function (rows) {
        res.redirect(`/users/${req.params.user_id}`);
      })
      .catch(function (error) {
        console.error(error);
        res.redirect(`/users/${req.params.user_id}`);
      });
  } else {
    knex("relationships")
      .insert({ followed_id: followed_id, follower_id: follower_id })
      .then(function (rows) {
        res.redirect(`/users/${req.params.user_id}`);
      })
      .catch(function (error) {
        console.error(error);
        res.redirect(`/users/${req.params.user_id}`);
      });
  }
})

module.exports = router;
