const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

async function followers_count(user_id) {

  return await knex
    .from("relationships")
    .join("users", "users.id", "=", "relationships.followed_id")
    .where({ follower_id: user_id })
    .then(function (rows) {
     return rows.length;
    });

}


async function following_count(user_id) {

  return await knex
    .from("relationships")
    .join("users", "relationships.follower_id", "=", "users.id")
    .where({ followed_id: user_id })
    .then(function (rows) {
      return rows.length;
    });

}


module.exports = {followers_count, following_count};