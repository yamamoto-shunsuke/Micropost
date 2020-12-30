const express = require('express');
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

router.get('/:id', function (req, res, next) {

  knex('users')
  .where({ id: req.params.id })
  .del()
  .then(function(rows){
    res.redirect('/');
  })
  
  .catch(function(error) {
    console.error(error)
  });
});


router.post('/:id', function (req, res, next) {
  const id = req.body.id;

  knex('microposts')
  .where('id',id)
  .del()
  .then(function(rows){
    res.redirect('/');
  })
  
  .catch(function(error) {
    console.error(error)
  });
});


module.exports = router;