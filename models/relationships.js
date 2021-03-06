const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

async function followers_count(user_id) {

  return await knex
    .from("relationships")
    .join("users", "users.id", "=", "relationships.followed_id")
    .where({ follower_id: user_id })
    .then(function (rows) {
     return rows;
    });

}


async function following_count(user_id) {

  return await knex
    .from("relationships")
    .join("users", "relationships.follower_id", "=", "users.id")
    .where({ followed_id: user_id })
    .then(function (rows) {
      return rows;
    });

}

async function micropost_count(user_id) {

  return await knex
    .from('users')
    .join('microposts', 'users.id', '=', 'microposts.user_id')
    .where({ user_id: user_id })
    .then(function (rows) {
      return rows;
    });

}


module.exports = {followers_count, following_count, micropost_count};