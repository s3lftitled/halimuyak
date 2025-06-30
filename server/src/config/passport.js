const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/userModel')

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/v1/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ email: profile.emails[0].value })

      if (existingUser) return done(null, existingUser)

      const newUser = await User.create({
        username: profile.displayName,
        email: profile.emails[0].value,
        isVerified: true
      })
      done(null, newUser)
    } catch (err) {
      done(err, null)
    }
  })
)

module.exports = passport
