const express = require('express');
const { authenticate } = require("./passport");
const router = express.Router();
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'micropost'
  },
  useNullAsDefault: true
});

router.get('/', function(req, res, next) {
  res.render('signin', { title: "Sign in Page" });
});

router.post("/login", authenticate());

module.exports = router;