const passport = require('passport');
const express = require('express');
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);


router.get('/:user_id', function (req, res, next) {
  let followed_id = 0;
  let following_id = 0;
  req.session.isfollow = false;

  knex("relationships")
    .where({ followed_id: req.user.id, follower_id: req.params.user_id })
    .then(function (rows) {
      if (rows.length >= 1) {
        req.session.isfollow = true;
      }
    });

    knex
    .from("relationships")
    .join("users", "users.id", "=","relationships.followed_id")
    .where({ follower_id: req.params.user_id })
    .then(function (rows) {
      followed_id = rows.length;
    })

 knex
    .from("relationships")
    .join("users", "relationships.follower_id", "=", "users.id")
    .where({ followed_id: req.params.user_id })
    .then(function (rows) {
      following_id = rows.length;
    });


  knex
    .from('users')
    .join('microposts', 'users.id', '=', 'microposts.user_id')
    .where({ user_id: req.params.user_id })
    .then(function (rows) {
      if(rows.length !== 0){
        res.render("profile", { isLoggedIn: req.isAuthenticated(), user_name: rows[0].name, contentList: rows, user_id: rows[0].id, page_location: req.params.user_id, isotherspage: req.user.id != req.params.user_id, isfollow: req.session.isfollow, followed_id: following_id, follower_id: followed_id });
      }else{
        knex
          .from('users')
          .where({ id: req.params.user_id })
          .then(function (rows) {
            res.render("profile", { isLoggedIn: req.isAuthenticated(), user_name: rows[0].name, contentList: null, user_id: rows[0].id, page_location: req.params.user_id, isotherspage: req.user.id != req.params.user_id, isfollow: req.session.isfollow, followed_id: following_id, follower_id: followed_id });
          });
      }
    });
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
