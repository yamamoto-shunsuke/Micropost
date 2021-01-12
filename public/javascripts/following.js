const knexfile = require("../../knexfile.js");
const knex = require("knex")(knexfile.development);

module.exports = function (req, res) {
  let following_id = 0;

  knex
    .from("relationships")
    .join("users", "relationships.follower_id", "=", "users.id")
    .where({ followed_id: req.user.id })
    .then(function (rows) {
      following_id = rows.length;
    });

};