const express = require('express');
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

/* GET users listing. */
router.get('/', function(req, res, next) {
  knex
  .select()
  .from("users")
  .then(function (rows) {
    res.render("users", {title: "All Users",user_name: req.user.name,user_id: req.user.id,userlist: rows,isLoggedIn: req.isAuthenticated()});
  })
  .catch(function (error) {
    res.render('users', { error: error});
  });
});

module.exports = router;
