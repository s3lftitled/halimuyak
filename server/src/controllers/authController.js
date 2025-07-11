// Import constants, logger, and services
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')
const { generateTokens } = require('../middlewares/jsonWebTokens')
const { 
  registerUserService,
  logInService,
  verifyEmailService,
} = require('../services/authServices')

/**
 * Controller handling user authentication operations.
 */
class AuthController {
  /**
   * Handles Google OAuth callback, generates JWT tokens, and redirects to frontend with access token.
   *
   * @param {import('express').Request} req - Express request object with authenticated user.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   */
  async googleCallback(req, res, next) {
    const user = req.user

    try {
      const { refreshToken, accessToken } = generateTokens(user)

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
      })

      res.redirect(`http://localhost:5174/google-success?accessToken=${accessToken}`)
    } catch (error) {
      logger.error(`Error logging in - ${error.message}`)
      next(error)
    }
  }

  /**
   * Handles user registration by calling the registration service and returning success response.
   *
   * @param {import('express').Request} req - Express request object containing user data (email, username, password).
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   */
  async registerUser(req, res, next) {
    const { username, email, password } = req.body

    try {
      const user = await registerUserService(email, username, password)

      res.status(HTTP_STATUS.CREATED).json({ 
        message: 'Registration successful! Check email for verification code. Account will be deleted if not verified within 30 mins.', 
        user 
      })
    } catch (error) {
      logger.error(`Registration error - ${error.message}`)
      next(error)
    }
  }

  /**
   * Verifies user's email using the provided verification code.
   *
   * @param {import('express').Request} req - Express request object containing email and verification code.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   */
  async verifyEmail(req, res, next) {
    const { email, verificationCode } = req.body
    try {
      await verifyEmailService(email, verificationCode)

      res.status(HTTP_STATUS.OK).json({ message: `Email verified successfully: ${email}` })
    } catch (error) {
      logger.error(`Email verification error - ${error.message}`)
      next(error)
    }
  }

  /**
   * Logs in a user by validating credentials and returning tokens.
   *
   * @param {import('express').Request} req - Express request object containing email and password.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   */
  async logIn(req, res, next) {
    const { email, password } = req.body
    try {
      const { user, accessToken, refreshToken } = await logInService(email, password)

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
      })

      res.status(HTTP_STATUS.OK).json({ user, accessToken, message: 'Log in successfully' })
    } catch (error) {
      logger.error(`Login error - ${error.message}`)
      next(error)
    }
  }
}

// Export an instance of AuthController
module.exports = new AuthController()
