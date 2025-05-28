const PerfumeCollection = require('../models/perfumeModel')
const logger = require('../logger/logger')
const { appAssert } = require('../utils/appAssert')
const HTTP_STATUS = require('../constants/httpConstants')
const perfumeSchema = require('../validators/perfumeValidator')
const sanitizeHtml = require('sanitize-html')
const { sanitizedOpts, cleanArray, sanitizeText } = require('../utils/sanitizeUtils')

const addNewPerfume = async (name, notes, image, links = {}, inspiration) => {
  try {
    // Sanitize basic string inputs
    const sanitizedName = sanitizeText(name)
    const sanitizedInspiration = sanitizeText(inspiration)
    const sanitizedImage = sanitizeText(image)

    // Normalize notes to array and sanitize
    let notesArray = []
    if (typeof notes === 'string') {
      notesArray = cleanArray(notes.split(','))
    } else if (Array.isArray(notes)) {
      notesArray = cleanArray(notes)
    }

    const rawData = {
      name: sanitizedName,
      inspiration: sanitizedInspiration,
      notes: notesArray,
      image: sanitizedImage,
      links: {
        shopee: sanitizeHtml(links.shopee || '', sanitizedOpts).trim(),
        lazada: sanitizeHtml(links.lazada || '', sanitizedOpts).trim(),
        tiktok: sanitizeHtml(links.tiktok || '', sanitizedOpts).trim(),
      },
    }

    // Validate input
    const { error, value } = perfumeSchema.validate(rawData)
    appAssert(!error, error?.message || 'Invalid input data', HTTP_STATUS.BAD_REQUEST)

    // Check for duplicates (case-insensitive)
    const existing = await PerfumeCollection.findOne({
      name: new RegExp(`^${value.name}$`, 'i'),
    }).lean()
    appAssert(!existing, 'Perfume with this name already exists', HTTP_STATUS.CONFLICT)

    // Insert new perfume
    const [newPerfume] = await PerfumeCollection.create([
      {
        name: value.name,
        notes: value.notes,
        image: value.image,
        links: value.links,
        inspiration: value.inspiration,
      },
    ])

    return newPerfume
  } catch (err) {
    logger.error(`Service error - ${err.message}`, { stack: err.stack })
    throw err
  }
}

module.exports = {
  addNewPerfume,
}
