var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
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

router.get('/', function(req, res, next) {
  res.render('signup', { title: "Sign up" });
});


router.post("/", async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirm = req.body.confirm;

  if(password !== confirm){
    res.render('signup',{
        title: "Sign up",
        pass: 'Password is incorrect'
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  knex
  .insert({ name: username, email: email, password: hashedPassword })
  .into('users')
  .then(function (rows) {
      res.redirect('/');
    })
    .catch(function (error) {
      console.log(error);
    });

});

module.exports = router;