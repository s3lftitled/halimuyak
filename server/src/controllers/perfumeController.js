const { addNewPerfume } = require('../services/perfumeServices')
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

class PerfumeController {
  async addNewPerfumeController(req, res, next) {
    const { name, notes, links, inspiration } = req.body
    const imageURL = req.file?.path

    try {
      const newPerfume = await addNewPerfume(name, notes, imageURL, parsedLinks, inspiration)

      res.status(HTTP_STATUS.CREATED).json({ 
        message: `New perfume has been added - ${newPerfume.name}`
      })
    } catch (error) {
      logger.error(`Adding new perfume error - ${error.message}`)
      next(error)
    }
  }
}

module.exports = new PerfumeController()
