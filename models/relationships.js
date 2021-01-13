const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

async function followers_count(followed_id, user_id) {

  return await knex
    .from("relationships")
    .join("users", "users.id", "=", "relationships.followed_id")
    .where({ follower_id: user_id })
    .then(function (rows) {
     followed_id = rows.length;
     return followed_id;
    });

}


async function following_count(following_id, user_id) {

  return await knex
    .from("relationships")
    .join("users", "relationships.follower_id", "=", "users.id")
    .where({ followed_id: user_id })
    .then(function (rows) {
      following_id = rows.length;
      return following_id;
    });

}


module.exports = {followers_count, following_count};