const express = require("express");
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);
const relationships = require('../models/relationships');


router.get("/:user_id/followers", async function (req, res, next) {
  const user_id = req.params.user_id;

  following_id = await relationships.followers_count(user_id);
  followed_id = await relationships.following_count(user_id);

  res.render("followers", { title: "Followers", isLoggedIn: req.isAuthenticated(), followers: following_id , user_name: req.user.name, user_id: req.user.id, followed_id: followed_id.length, follower_id: following_id.length });

});

router.post("/", function (req, res, next) {
  res.render("followers");
});

module.exports = router;
