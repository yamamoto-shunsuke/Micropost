var express = require('express');
var router = express.Router();
//var { authenticate } = require("./login");
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'micropost'
  },
  useNullAsDefault: true
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Welcome to the MicroPost App" });
});

router.post("/", (req, res, next) => {


});

module.exports = router;
