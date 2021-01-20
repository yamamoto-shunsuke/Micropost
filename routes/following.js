const express = require("express");
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);
const relationships = require('../models/relationships');


router.get("/:user_id/following", async function (req, res, next) {
  const user_id = req.params.user_id;

  following_id = await relationships.followers_count(user_id)
  .catch(function (error) {
    res.render('following', { error: error});
  });
  followed_id = await relationships.following_count(user_id)
  .catch(function (error) {
    res.render('following', { error: error});
  });
  microposts = await relationships.micropost_count(user_id)
  .catch(function (error) {
    res.render('following', { error: error});
  });

  res.render("following", { title: "Following", isLoggedIn: req.isAuthenticated(), follows: followed_id, user_name: req.user.name, user_id: req.user.id, followed_id: followed_id.length, follower_id: following_id.length,microposts: microposts.length});

});

router.post("/", function (req, res, next) {
  res.render("following");
});

module.exports = router;
