const express = require('express')
const passport = require('passport')
const AuthController = require('../controllers/authController')

const router = express.Router()

// Initiates Google OAuth
router.get('/v1/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'consent',
}))

// Callback after Google login
router.get(
  '/v1/google/callback',
  passport.authenticate('google', { session: false }),
  AuthController.googleCallback
)

router.post(
  '/v1/registration',
  AuthController.registerUser
)

router.post(
  '/v1/login',
  AuthController.logIn
)

router.post(
  '/v1/email-verification',
  AuthController.verifyEmail
)

module.exports = router
