const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);
const session = require('express-session');
const sessionStore = new session.MemoryStore;
const User = require('../models/user.js');//モデル化したfindByIdメソッドの呼び出し

//実行した際に、app.jsでこのファイルが読み込まれ、このファイルのどの部分から実行すればよいかを明確にするため。
module.exports = function (app) {

  //　セッション情報設定                                                                                             
  app.use(session({
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: true,
    secret: 'anything'
  }));
  //passport初期化
  app.use(passport.initialize());
  //req.userの更新
  app.use(passport.session());

  //ユーザー名とパスワードを利用した認証
  passport.use(
    "local-strategy",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      (email, password, done) => {
        knex("users")
          .where({ email: email })
          .then(async function (rows) {
            //==とすることで、データ型が一致しているかどうかまで厳密に判定を行う。
            if (rows.length !== 0) {
              const comparedPassword = await bcrypt.compare(password, rows[0].password);
              if (comparedPassword) {
                done(null, rows[0]);
              } else {
                return done(null,false, { message: "The user name or password is incorrect." })
              };
            } else {
              return done(null,false, { message: "The user name or password is incorrect." });
            }
          });
      }
    )
  );

  //サーバからクライアントに保存する処理
  //ログイン時(strategy実行時にしか実行されない)
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });


  //クライアントからサーバに復元する処理
  //セッションの有効期間中は常に機能する。req.userに値を入れる。
  passport.deserializeUser( async function (id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  })
};