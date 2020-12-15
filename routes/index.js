const express = require('express');
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    knex('microposts')
      .then(function (rows) {
        const content = rows;
        res.render('index', { title: "Profile App", isLoggedIn: req.isAuthenticated(), user_id: req.session.user_id, user_name: req.session.user_name, contentList: content });
      });
  } else {
    res.render('index', { title: "Welcome to the MicroPost App", isLoggedIn: req.isAuthenticated(), user_name: req.session.user_name });
  }
});

router.post("/", (req, res, next) => {

});

module.exports = router;
