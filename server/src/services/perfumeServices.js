const PerfumeCollection = require('../models/perfumeModel')
const logger = require('../logger/logger')
const { appAssert } = require('../utils/appAssert')
const HTTP_STATUS = require('../constants/httpConstants')

const isValidString = (str, min = 1) => typeof str === 'string' && str.trim().length >= min

const addNewPerfume = async (name, notes, image, links, inspiration) => {
  try {
    // Validate name
    appAssert(isValidString(name, 3) && name.length <= 50, "Invalid perfume name", HTTP_STATUS.BAD_REQUEST)
    
    const existing = await PerfumeCollection.findOne({ name })
    appAssert(!existing, "Perfume with this name already exists", HTTP_STATUS.CONFLICT)

    // Handle notes - convert string to array if needed
    let processedNotes = notes
    if (typeof notes === 'string') {
      // Split by comma and clean up each note
      processedNotes = notes.split(',').map(note => note.trim()).filter(note => note.length > 0)
      // Sample input string: "vanilla , lavender, musky, "
      // Step 1 - Split by comma(split method): ["vanilla ", " lavender", " musky", " "]
      // Step 2 - Map each item then trim them: ["vanilla", "lavender", "musky", ""]
      // Step 3 - Filter out empty strings: ["vanilla", "lavender", "musky"]
    }
    
    // Validate processed notes
    appAssert(
      Array.isArray(processedNotes) && 
      processedNotes.length > 0 && 
      processedNotes.every(n => isValidString(n)), 
      "Invalid notes array", 
      HTTP_STATUS.BAD_REQUEST
    )
    
    // Validate image (allow both http/https URLs and file paths)
    appAssert(
      isValidString(image) && 
      (image.startsWith("http") || image.includes('uploads/')), 
      "Invalid image URL or path", 
      HTTP_STATUS.BAD_REQUEST
    )
    
    // Process and validate links - set missing links to empty string
    let processedLinks = {
      shopee: '',
      lazada: '',
      tiktok: ''
    }
    
    if (links && typeof links === 'object') {
      // Only validate non-empty links
      for (const [key, value] of Object.entries(links)) {
        if (['shopee', 'lazada', 'tiktok'].includes(key)) {
          if (value && typeof value === 'string' && value.trim()) {
            appAssert(isValidString(value), `Invalid ${key} link`, HTTP_STATUS.BAD_REQUEST)
            processedLinks[key] = value.trim()
          }
        }
      }
    }
    
    // Validate inspiration
    appAssert(isValidString(inspiration), "Invalid inspiration", HTTP_STATUS.BAD_REQUEST)

    const newPerfume = await PerfumeCollection.create({
      name, 
      notes: processedNotes, 
      image, 
      links: processedLinks, 
      inspiration
    })

    return newPerfume
    
  } catch (err) {
    logger.error(`Service error - ${err.message}`)
    throw err
  }
}

module.exports = {
  addNewPerfume,
}