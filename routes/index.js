const express = require('express');
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

router.use('/accounts/signup', require('./signup'));
router.use('/accounts/signin', require('./signin'));

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.user.email);
    knex('microposts')
      .then(function (rows) {
        const content = rows;
        res.render('index', { title: "Profile App", isLoggedIn: req.isAuthenticated(), user_id: req.user.user_id, user_name: req.user.name, contentList: content });
      });
  } else {
    res.render('index', { title: "Welcome to the MicroPost App", isLoggedIn: req.isAuthenticated(), user_name: req.session.user_name });
  }
});

router.post("/", (req, res, next) => {
  const user_id = req.session.user_id;
  const content = req.body.content;
  knex("microposts")
    .where({ id: user_id })
    .update({ content: content })
    .then(function (rows) {
      res.redirect("/");
    })
    .catch(function (error) {
      console.error(error);
      res.redirect("/");
    });
});

module.exports = router;
