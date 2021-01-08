const express = require("express");
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);


router.get("/:user_id/followers", function (req, res, next) {
  knex
    .from("relationships")
    .join("users", "users.id", "=","relationships.followed_id")
    .where({ follower_id: req.params.user_id })
    .then(function (rows) {
      res.render("followers", {title: "Followers",isLoggedIn: req.isAuthenticated(),followers: rows,user_name: req.user.name,user_id: req.user.id, followed_id: req.session.count_followed_id, follower_id: req.session.count_follower_id});
    })
        .catch(function (error) {
          console.error(error);
        });
    });

  router.post("/", function (req, res, next) {
    res.render("followers");
  });

  module.exports = router;
