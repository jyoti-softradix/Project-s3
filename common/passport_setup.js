require('dotenv').config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const facebookStrategy = require("passport-facebook").Strategy;
const linkedinStrategy = require('passport-linkedin-oauth2').Strategy;

// Passport session setup.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

//google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      profileFields: [
        "id",
        "displayName",
        "name",
        "picture.type(large)",
        "email",
      ],
    },
    function (request, accessToken, refreshToken, profile, done) {
      // console.log('profile', profile)
      return done(null, profile);
    }
  )
);

//facebook
passport.use(
  new facebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: [
        "id",
        "displayName",
        "name",
        "picture.type(large)",
        "email",
      ],
    },
    function (token, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

// linkedin
passport.use(new linkedinStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: [
        "id",
        "displayName",
        "name",
        "picture.type(large)",
        "email",
      ],
    },
    function (token, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

module.exports = passport;
