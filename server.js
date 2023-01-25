require("dotenv").config();
const db = require("./Model/db");
const users = require("./src/user/index");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require('passport');
const session = require('express-session');
require('./common/passport_setup');

const app = express();
app.use(bodyParser.json());

// google and facebook authentication
//configure app sessions
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//route of api
app.use("/", users);


app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index");
});

//Google Auth routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/failed", (req, res) => res.send("You Failed to log in!"));
// In this route you can see that if the user is logged in u can access his info in: req.user
app.get("/good", (req, res) => {
  res.render("profile.ejs", {
    name: req.user.displayName,
    pic: req.user._json.picture,
    email: req.user.emails[0].value,
    profile: "google",
  });
});
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failed' }),
  (req, res) => {
    res.redirect('/good');
  });


// // nqixnlmvefsjprii

  
app.get("/profile", (req, res) => {
  console.log('req.user')
    res.render("profile.ejs", {
      profile: "google",
      name: req.user.displayName,
      pic: req.user.photos[0].value,
      email: req.user.emails[0].value, // get the user out of session and pass to template
    });
  });


//Facebook Auth routes
app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

app.get("/good", (req, res) => {
  res.render("profile.ejs", {
    name: req.user.displayName,
    pic: req.user._json.picture,
    email: req.user.emails[0].value,
    profile: "facebook",
  });
});

app.get('/auth/facebook/callback',
   passport.authenticate('facebook', {
    successRedirect: "/profile",
    failureRedirect: "/good",
}))

app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
})


app.listen(5000, () => {
  console.log("listening on *:5000");
});
