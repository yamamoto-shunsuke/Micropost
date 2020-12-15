const express = require('express');
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    res.render('index', { title: "Profile App",isLoggedIn: req.isAuthenticated()});
  }else{
    res.render('index', { title: "Welcome to the MicroPost App",isLoggedIn: req.isAuthenticated()});
  }
});

router.post("/", (req, res, next) => {

});

module.exports = router;
