const { addNewPerfumeService, fetchAllPerfumesService } = require('../services/perfumeServices')
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

/**
 * Controller for handling perfume-related operations.
 */
class PerfumeController {
  /**
   * Adds a new perfume to the system using the request body and uploaded file.
   *
   * @param {import('express').Request} req - Express request object with perfume details in body and file for image.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   */
  async addNewPerfume(req, res, next) {
    const { name, notes, links, inspiration } = req.body
    const imageURL = req.file?.path

    try {
      // `parsedLinks` assumed to be a processing step, you can parse it from links here if needed
      const parsedLinks = links // TODO: Parse or validate if it's a stringified array or similar

      const newPerfume = await addNewPerfumeService(name, notes, imageURL, parsedLinks, inspiration)

      res.status(HTTP_STATUS.CREATED).json({ 
        message: `New perfume has been added - ${newPerfume.name}`
      })
    } catch (error) {
      logger.error(`Adding new perfume error - ${error.message}`)
      next(error)
    }
  }

  /**
   * Fetches all perfumes with optional pagination and search query.
   *
   * @param {import('express').Request} req - Express request object containing optional page, limit, and search query params.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   */
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
