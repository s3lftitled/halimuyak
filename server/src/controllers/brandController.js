const { 
  addNewBrandService,
  fetchBrandDetailsService,
  fetchAllBrandsService,
  editBrandDetailsService,
 } = require('../services/brandServices')
const HTTP_STATUS = require('../constants/httpConstants')
const logger = require('../logger/logger')

class BrandController {

  async addNewBrand (req, res, next) {
    try {
      const brandData = req.body

      const { message, data } = await addNewBrandService(brandData)

      logger.logInfo(message, req, { name: data.brand.name })

      res.status(HTTP_STATUS.CREATED).json({ message, data})
    } catch (error) {
      logger.error(`Error adding new brand - ${error.message}`)
      next(error)
    }
  }

  async fetchBrandDetails (req, res, next) {
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

  async fetchAllBrands (req, res, next) {
    const { page, limit } = req.query
    try {

      const { message, data } = await fetchAllBrandsService()

      logger.logInfo(message, req,   
        {
          totalBrands: data.length,
          page: Number(page) || 1,
          limit: Number(limit) || 20
        }
      )

      res.status(HTTP_STATUS.OK).json({ message, data })
    } catch (error) {
      logger.error(`Error fetching brand details - ${error.message}`)
      next(error)
    }
  }

  async editBrandDetails (req, res, next) {
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