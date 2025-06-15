const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')
const { generateTokens } = require('../middlewares/jsonWebTokens')

class AuthController {
  async googleCallback (req, res, next) {
    const user = req.user

    try {
      const { refreshToken, accessToken } = generateTokens(user)

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
      })

      res.status(HTTP_STATUS.OK).json({ message: 'Logged in with Google', accessToken })
    } catch (error) {
      logger.error(`Error logging in- ${error.message}`)
      next(error)
    }
  }
}

module.exports = new AuthController()
