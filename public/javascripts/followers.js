const express = require('express');
const router = express.Router();
const knexfile = require("../../knexfile.js");
const knex = require("knex")(knexfile.development);

module.exports = function (followed_id,req, res) {
  console.log("通過しました！");

  knex
    .from("relationships")
    .join("users", "users.id", "=", "relationships.followed_id")
    .where({ follower_id: req.user.id })
    .then(function (rows) {
     followed_id = rows.length;
    })

};


module.exports = router;
