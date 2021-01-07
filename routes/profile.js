const passport = require('passport');
const express = require('express');
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);


router.get('/:user_id', function (req, res, next) {
  req.session.count_follower_id = 0;
  req.session.count_followed_id = 0;
  const location = req.params.user_id;
  req.session.isfollow = false;
  let user_name = null;

  knex('users')
   .where({ id: req.params.user_id })
   .then(function(rows){
     user_name = rows[0].name;
   })

  knex("relationships")
    .where({ followed_id: req.user.id, follower_id: location })
    .then(function (rows) {
      if (rows.length >= 1) {
        req.session.isfollow = true;
      }
    });

  knex
    .from('microposts')
    .innerJoin("relationships", "microposts.user_id", "relationships.followed_id")
    .then(function (rows) {
      for (let i = 0; i < rows.length; i++) {
        if (location == rows[i].follower_id) {
          req.session.count_follower_id++;
        }
      }
    })

  knex
    .from("microposts")
    .innerJoin("relationships", "microposts.user_id", "relationships.follower_id")
    .then(function (rows) {
      for (let i = 0; i < rows.length; i++) {
        if (location == rows[i].followed_id) {
          req.session.count_followed_id++;
        }
      }
    });


  knex("microposts")
    .where({ user_id: req.params.user_id })
    .then(function (rows) {
      res.render("profile", { isLoggedIn: req.isAuthenticated(), user_name: user_name, contentList: rows, user_id: rows[0].id, page_location: location, isotherspage: req.user.id != location, isfollow: req.session.isfollow, followed_id: req.session.count_followed_id, follower_id: req.session.count_follower_id });
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
