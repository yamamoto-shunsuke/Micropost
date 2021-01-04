const express = require('express');
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

router.get('/', function (req, res, next) {

});

router.post('/', function (req, res, next) {

});

module.exports = router;