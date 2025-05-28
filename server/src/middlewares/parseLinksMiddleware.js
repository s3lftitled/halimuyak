const logger = require('../logger/logger')
const HTTP_STATUS = require('../constants/httpConstants')

function parseLinksMiddleware(req, res, next) {
  const { links } = req.body

  if (typeof links === 'string') {
    try {
      parsedLinks = JSON.parse(links)
    } catch (err) {
      logger.error(`Invalid links JSON: ${err.message}`)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid links format' })
    }
  }
  next()
}

module.exports = parseLinksMiddleware
