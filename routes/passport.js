const passport = require("passport");
const express = require('express');
const bcrypt = require("bcrypt");
const router = express.Router();
const LocalStrategy = require("passport-local").Strategy;
let initialize, authenticate, authorize;
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);


//サーバからクライアントに保存する処理
passport.serializeUser((email, done) => {
  done(null, email);
});


//クライアントからサーバに復元する処理
passport.deserializeUser((email, done) => {
  done(null, email);
});

//ユーザー名とパスワードを利用した認証
passport.use(
  "local-strategy",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      req.session.password = req.body.password;
      knex("users")
        .where({ email: email })
        .then(async function (rows) {
          if (rows != "") {
            const comparedPassword = await bcrypt.compare(password, rows[0].password);
            if (comparedPassword) {
              req.session.email = email;
              req.session.user_id = rows[0].id;
              done(null, email);
            } else {
              done(
                null,
                false,
                req.flash(
                  "message",
                  "The user name or password is incorrect。"
                )
              )
            };
          } else {
            done(
              null,
              false,
              req.flash(
                "message",
                "The user name or password is incorrect."
              )
            );
          }
        });
    }
  )
);

initialize = function () {
  return [
    passport.initialize(),
    passport.session()
  ];
};

//認証成功時処理
authenticate = function () {
  return passport.authenticate(
    "local-strategy", {
    successRedirect: "/",
    failureRedirect: "/accounts/signin"
  }
  );
};




module.exports = {
  initialize,
  authenticate,
  authorize,
  router
};