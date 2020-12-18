const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

async function findById(userId) {
  await knex('users')
    .then(function (rows) {
      return rows[0].id;
    })
};

module.exports = {findById};