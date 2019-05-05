const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      //console.log(accessToken, refreshToken, profile, done);

      const existingUser = await User.findOne({
        providerUserId: profile.id,
        provider: profile.provider
      });

      if (existingUser) {
        console.log('User exists');
        done(null, existingUser);
      } else {
        const user = await new User({
          providerUserId: profile.id,
          provider: profile.provider
        }).save();
        done(null, user);
      }
    }
  )
);