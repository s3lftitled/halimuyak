const { 
  addNewBrandService,
  fetchBrandDetailsService,
  fetchAllBrandsService,
  editBrandDetailsService,
} = require('../services/brandServices')
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

/**
 * Controller for handling operations related to perfume brands.
 */
class BrandController {

  /**
   * Adds a new brand using the brand data provided in the request body.
   *
   * @param {import('express').Request} req - Express request object containing brand data in body.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   */
  async addNewBrand(req, res, next) {
    try {
      const brandData = req.body

      const { message, data } = await addNewBrandService(brandData)

      logger.logInfo(message, req, { name: data.brand.name })

      res.status(HTTP_STATUS.CREATED).json({ message, data })
    } catch (error) {
      logger.error(`Error adding new brand - ${error.message}`)
      next(error)
    }
  }

  /**
   * Fetches details of a specific brand using brand ID from the route params.
   *
   * @param {import('express').Request} req - Express request object containing brandId in params.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   */
  async fetchBrandDetails(req, res, next) {
    const brandId = req.params.brandId
    try {
      const { message, data } = await fetchBrandDetailsService(brandId)

      logger.logInfo(message, req, { brandId: data._id })

      res.status(HTTP_STATUS.OK).json({ message, data })
    } catch (error) {
      logger.error(`Error fetching brand details - ${error.message}`)
      next(error)
    }
  }

  /**
   * Fetches all brands. Optional pagination support via query params.
   *
   * @param {import('express').Request} req - Express request object with optional `page` and `limit` query params.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   */
  async fetchAllBrands(req, res, next) {
    const { page, limit } = req.query
    try {
      const { message, data } = await fetchAllBrandsService()

      logger.logInfo(message, req, {
        totalBrands: data.length,
        page: Number(page) || 1,
        limit: Number(limit) || 20,
      })

      res.status(HTTP_STATUS.OK).json({ message, data })
    } catch (error) {
      logger.error(`Error fetching all brands - ${error.message}`)
      next(error)
    }
  }

  /**
   * Edits brand details using the brand ID from the route params and updated data from the body.
   *
   * @param {import('express').Request} req - Express request object containing brandId in params and updatedData in body.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   */
  async editBrandDetails(req, res, next) {
    const { brandId } = req.params
    const { updatedData } = req.body
    try {
      const { message, data } = await editBrandDetailsService(brandId, updatedData)

      logger.logInfo(message, req, { brandId: data._id })

      res.status(HTTP_STATUS.OK).json({ message, data })
    } catch (error) {
      logger.error(`Error editing brand details - ${error.message}`)
      next(error)
    }
  }
}

module.exports = new BrandController()
