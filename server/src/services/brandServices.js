const BrandCollection = require('../models/brandModel')
const { appAssert } = require('../utils/appAssert')
const HTTP_STATUS = require('../constants/httpConstants')
const { brandValidator, patchBrandValidator } = require('../validators/brandValidator')
const { sanitizeObject, isValidMongoId, sanitizePaginationInputs } = require('../utils/sanitizeUtils')

/**
 * Adds a new perfume brand to the database.
 * 
 * @param {Object} brandData - Raw brand data from user input
 * @returns {Promise<{ message: string, data: Object }>} Response message and saved brand data
 * @throws Will throw an error if validation fails or the brand already exists
 */
const addNewBrandService = async (brandData) => {
  try {
    const cleanedBrandData = sanitizeObject(brandData)

    const { error, value } = brandValidator.validate(cleanedBrandData)
    appAssert(!error, error?.message || 'Invalid input data', HTTP_STATUS.BAD_REQUEST)

    const existingBrand = await BrandCollection.findOne({ name: value.name })
    appAssert(!existingBrand, 'Brand name already exists', HTTP_STATUS.CONFLICT)

    const newBrand = new BrandCollection(value)
    const savedBrand = await newBrand.save()

    return {
      message: 'Brand created successfully',
      data: savedBrand,
    }
  } catch (error) {
    throw error
  }
}

/**
 * Fetches brand details by ID.
 * 
 * @param {string} brandId - The MongoDB ObjectId of the brand
 * @returns {Promise<{ message: string, data: Object }>} Response message and brand details
 * @throws Will throw an error if brandId is invalid or brand not found
 */
const fetchBrandDetailsService = async (brandId) => {
  try {
    appAssert(brandId && typeof brandId === 'string' && brandId.trim().length > 0, 'Brand ID is required', HTTP_STATUS.BAD_REQUEST)
    isValidMongoId(brandId)

    const brandDetails = await BrandCollection.findById(brandId)
    appAssert(brandDetails, 'Perfume brand doesnt exists', HTTP_STATUS.NOT_FOUND)

    return {  
      message: 'Perfume brand details fetched succesfully',
      data: brandDetails,
    }
  } catch (error) {
    throw error
  }
}

/**
 * Fetches all brands with pagination support.
 * 
 * @param {any} page - Current page number
 * @param {any} limit - Number of brands per page
 * @returns {Promise<{ message: string, data: Object[] }>} Paginated list of brands
 * @throws Will throw an error if no brands are found
 */
const fetchAllBrandsService = async (page, limit) => {
  try {
    const { sanitizedPage, sanitizedLimit } = sanitizePaginationInputs(page, limit)
    const skip = (sanitizedPage - 1) * sanitizedLimit

    const allBrands = await BrandCollection.find().skip(skip).limit(sanitizedLimit)
    appAssert(allBrands, 'No brands found', HTTP_STATUS.NOT_FOUND)

    return {
      message: 'Fetched all brands succesfully',
      data: allBrands,
    }
  } catch (error) {
    throw error
  }
}

/**
 * Edits details of an existing brand.
 * 
 * @param {string} brandId - The MongoDB ObjectId of the brand to edit
 * @param {Object} updatedData - Partial brand data with fields to update
 * @returns {Promise<{ message: string, data: Object }>} Updated brand data
 * @throws Will throw an error if validation fails or no changes detected
 */
const editBrandDetailsService = async (brandId, updatedData) => {
  try {
    appAssert(brandId && typeof brandId === 'string' && brandId.trim().length > 0, 'Brand ID is required', HTTP_STATUS.BAD_REQUEST)
    isValidMongoId(brandId)

    const cleanedData = sanitizeObject(updatedData)
    const { error, value } = patchBrandValidator.validate(cleanedData, { allowUnknown: true })
    appAssert(!error, error?.message || 'Invalid input data', HTTP_STATUS.BAD_REQUEST)

    const brand = await BrandCollection.findById(brandId)
    appAssert(brand, 'Brand not found', HTTP_STATUS.NOT_FOUND)

    const changes = {}
    Object.keys(value).forEach(key => {
      if (value[key] !== undefined && brand[key] !== value[key]) {
        changes[key] = value[key]
      }
    })

    appAssert(Object.keys(changes).length > 0, 'No changes detected in the update', HTTP_STATUS.BAD_REQUEST)

    const updatedBrand = await BrandCollection.findByIdAndUpdate(brandId, { $set: changes }, { new: true })

    return {
      message: 'Brand updated successfully',
      data: updatedBrand,
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  addNewBrandService,
  fetchBrandDetailsService,
  fetchAllBrandsService,
  editBrandDetailsService,
}
