const { addNewPerfumeService, fetchAllPerfumesService } = require('../services/perfumeServices')
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

class PerfumeController {
  async addNewPerfume(req, res, next) {
    const { name, notes, links, inspiration } = req.body
    const imageURL = req.file?.path

    try {
      const newPerfume = await addNewPerfumeService(name, notes, imageURL, parsedLinks, inspiration)

      res.status(HTTP_STATUS.CREATED).json({ 
        message: `New perfume has been added - ${newPerfume.name}`
      })
    } catch (error) {
      logger.error(`Adding new perfume error - ${error.message}`)
      next(error)
    }
  }

  async fetchAllPerfumes(req, res, next) {
    const { page, limit, search } = req.query

    try {
      console.log(req.query)
      const foundPerfumes = await fetchAllPerfumesService({ page, limit, search })

      res.status(HTTP_STATUS.OK).json({ foundPerfumes })
    } catch (error) {
      logger.error(`Error fetching perfume - ${error.message}`)
      next(error)
    }
  }
}

module.exports = new PerfumeController()
