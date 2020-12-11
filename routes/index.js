const express = require('express');
const app = express();
const router = express.Router();
//var { authenticate } = require("./login");
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

app.use('/', require('index'));
app.use('/accounts/signup', require('./routes/signup'));
app.use('/accounts/signin', require('./routes/signin'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Welcome to the MicroPost App" });
});

router.post("/", (req, res, next) => {


});

module.exports = app,router;
