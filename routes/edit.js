const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

router.get('/', function (req, res, next) {
  res.render('edit', { title: "Update your profile", user_id: req.user.id, isLoggedIn: req.isAuthenticated(),  message: req.flash("message") });
});

router.post("/", async function (req, res, next) {
  const user_name = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirm = req.body.confirm;
  const user_id = req.user.id;

    //バリデート処理
    if (password !== confirm) {
      req.flash("message", "Password(retype) is incorrect");
      res.redirect("/accounts/edit");
    }
  
    //passwordをハッシュ化してupdate
    const hashedPassword = await bcrypt.hash(password, 10);

    await knex("users")
      .where({ id: user_id })
      .update({ name: user_name, email: email, password: hashedPassword })
      .then(function (rows) {
        //変更後のユーザー情報を再取得するためログアウトにリダイレクト
       res.redirect("/logout");
      })
      .catch(function (error) {
        res.render('edit', { error: error});
      });

});

module.exports = router;