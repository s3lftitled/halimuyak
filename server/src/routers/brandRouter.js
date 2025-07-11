const express = require("express")
const router = express.Router()
const BrandController = require('../controllers/brandController')

router.post('/v1/add-new-brand', BrandController.addNewBrand)
router.get('/v1/fetch-brand-details/:brandId', BrandController.fetchBrandDetails)
router.get('/v1/fetch-all-brands', BrandController.fetchAllBrands)
router.patch('/v1/edit-brand-details/:brandId', BrandController.editBrandDetails)

module.exports = router