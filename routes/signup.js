const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

router.get('/', function(req, res, next) {
  res.render('signup', { title: "Sign up" ,isLoggedIn: req.isAuthenticated()});
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
    const id = rows[0];
    knex
    .insert({ content: " ",user_id: id})
    .into('microposts')
    .then(function(rows){
      req.session.id++
      res.redirect('/');
    })
    })
    .catch(function (error) {
      console.log(error);
    });

});

module.exports = router;