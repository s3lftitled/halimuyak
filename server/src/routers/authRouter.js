const express = require('express')
const passport = require('passport')
const authController = require('../controllers/authController')

const router = express.Router()

// Initiates Google OAuth
router.get('/v1/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}))

// Callback after Google login
router.get(
  '/v1/auth/google/callback',
  passport.authenticate('google', { session: false }),
  authController.googleCallback
)

module.exports = router
