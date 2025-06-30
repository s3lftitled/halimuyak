const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')
const { generateTokens } = require('../middlewares/jsonWebTokens')
const { 
  registerUserService,
  logInService,
  verifyEmailService,
 } = require('../services/authServices')

class AuthController {
  async googleCallback (req, res, next) {
    const user = req.user

    try {
      const { refreshToken, accessToken } = generateTokens(user)

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
      })

      res.redirect(`http://localhost:5174/google-success?accessToken=${accessToken}`)
    } catch (error) {
      logger.error(`Error logging in- ${error.message}`)
      next(error)
    }
  }

  async registerUser (req, res, next ) {
    const { username, email, password } = req.body

    try {
      const user = await registerUserService(email, username, password)

      res.status(HTTP_STATUS.CREATED).json({ message: 'Registration successful! Check email for verification code. Account will be deleted if not verified within 30 mins.', user})
    } catch(error) {
      logger.error(`Registration error - ${error.message}`)
      next(error)
    }
  }

  async verifyEmail (req, res, next) {
    const { email, verificationCode } = req.body
    try {
      await verifyEmailService(email, verificationCode)

      res.status(HTTP_STATUS.OK).json({ message: `Email verified succesfully: ${email}` })
    } catch (error) {
      logger.error(`Registration error - ${error.message}`)
      next(error)
    }
  }

  async logIn(req, res, next) {
    const { email, password } = req.body
    try {
      const { user, accessToken, refreshToken} = await logInService(email, password)

      // Set cookies
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
      })

      res.status(HTTP_STATUS.OK).json({ user, accessToken, message: 'Log in succesfully' })
    } catch (error) {
      logger.error(`Login error - ${error.message}`)
      next(error)
    }
  }
}

module.exports = new AuthController()
