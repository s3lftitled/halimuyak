const express = require("express")
const router = express.Router()
const upload = require("../middlewares/upload")
const parseLinksMiddleware = require("../middlewares/parseLinksMiddleware")
const PerfumeController = require('../controllers/perfumeController')

router.post(
  '/v1/add-perfume',
  upload.single("image"),          
  parseLinksMiddleware,            
  PerfumeController.addNewPerfume
)

router.get(
  '/v1/fetch-perfume/',
  PerfumeController.fetchAllPerfumes
)

module.exports = router
