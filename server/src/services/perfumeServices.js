const PerfumeCollection = require('../models/perfumeModel')
const logger = require('../logger/logger')
const { appAssert } = require('../utils/appAssert')
const HTTP_STATUS = require('../constants/httpConstants')
const perfumeValidator = require('../validators/perfumeValidator')
const sanitizeHtml = require('sanitize-html')
const { sanitizedOpts, cleanArray, sanitizeText, sanitizePaginationInputs } = require('../utils/sanitizeUtils')
const { isFuzzyMatch } = require('../utils/fuzzyMatch')

/**
 * Adds a new perfume to the collection after sanitizing, validating, and checking for duplicates.
 *
 * @param {string} name - The name of the perfume.
 * @param {string[]|string} notes - Notes describing the perfume (e.g., 'citrus, floral').
 * @param {string} image - URL of the perfume image.
 * @param {Object} [links={}] - Optional e-commerce links for the perfume.
 * @param {string} [links.shopee] - Shopee product URL.
 * @param {string} [links.lazada] - Lazada product URL.
 * @param {string} [links.tiktok] - TikTok shop URL.
 * @param {string} inspiration - The inspiration behind the perfume.
 * @returns {Promise<Object>} The newly created perfume document.
 * @throws {Error} If validation fails, a duplicate perfume exists, or a database error occurs.
 */
const addNewPerfumeService = async (name, notes, image, links = {}, inspiration) => {
  try {
    // Sanitize basic string inputs to remove unwanted characters or tags
    const { sanitizedName, sanitizedInspiration, sanitizedImage } = sanitizeText({ name, inspiration, image })

    // Normalize the 'notes' input to an array and sanitize it
    // If notes is a string, split by commas and clean up each note
    // If notes is already an array, clean it directly
    let notesArray = []
    if (typeof notes === 'string') {
      notesArray = cleanArray(notes.split(','))
    } else if (Array.isArray(notes)) {
      notesArray = cleanArray(notes)
    }

    // Prepare the raw data object to be validated and saved
    // Also sanitize URLs inside the 'links' object to prevent XSS or malicious input
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

    // Validate the sanitized data against the perfume schema
    // Throws an error if validation fails (e.g., missing required fields, wrong types)
    const { error, value } = perfumeValidator.validate(rawData)
    appAssert(!error, error?.message || 'Invalid input data', HTTP_STATUS.BAD_REQUEST)

    // Check for existing perfume with the same name (case-insensitive)
    // Prevents duplicate entries in the database
    const existing = await PerfumeCollection.findOne({
      name: new RegExp(`^${value.name}$`, 'i'),
    }).lean()
    appAssert(!existing, 'Perfume with this name already exists', HTTP_STATUS.CONFLICT)

    // Insert the new perfume into the database
    // Create returns an array; destructure to get the first (and only) created document
    const [newPerfume] = await PerfumeCollection.create([
      {
        name: value.name,
        notes: value.notes,
        image: value.image,
        links: value.links,
        inspiration: value.inspiration,
      },
    ])

    // Return the newly created perfume document
    return newPerfume
  } catch (err) {
    // Log any error with stack trace for debugging, then rethrow it to be handled upstream
    logger.error(`Service error - ${err.message}`, { stack: err.stack })
    throw err
  }
}

/**
 * Fetches all perfumes with optional fuzzy or exact search and paginated results.
 *
 * @param {Object} [params={}] - Parameters for pagination and search.
 * @param {number|string} [params.page=1] - The current page number (defaults to 1).
 * @param {number|string} [params.limit=10] - The number of items per page (defaults to 10).
 * @param {string} [params.search] - Optional search query for perfume name, notes, or inspiration.
 * @returns {Promise<Object>} Paginated perfume results and metadata.
 * @throws {Error} If any database or search operation fails.
 */

const fetchAllPerfumesService = async ({ page, limit, search } = {}) => {
  try {
     const sanitizedSearch = sanitizeText(search).toLowerCase()

     console.log(sanitizedSearch)

     const { sanitizedPage, sanitizedLimit } = sanitizePaginationInputs(page, limit)

    // Split sanitized search string into individual keywords, filtering out empty strings
    // Supports splitting by spaces, commas, or combinations (e.g., "floral, fresh" -> ["floral", "fresh"])
    const searchTerms = sanitizedSearch
      ? sanitizedSearch.split(/\s+|,+/).filter(Boolean)
      : []

    // If no search terms, return all perfumes with pagination
    if (searchTerms.length === 0) {
      const total = await PerfumeCollection.countDocuments({})
      const totalPages = Math.ceil(total / sanitizedLimit)
      const skip = (sanitizedPage - 1) * sanitizedLimit

      const perfumes = await PerfumeCollection.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(sanitizedLimit)
        .lean()

      return {
        page: sanitizedPage,
        limit: sanitizedLimit,
        total,
        totalPages,
        data: perfumes,
      }
    }

    // STEP 1: Try exact regex matching first
    const regexTerms = searchTerms.map(term => new RegExp(term, 'i'))

    // Construct a MongoDB filter to perform an exact (regex-based) match on one or more fields.
    // If there's only one search term, use a simple `$or` filter across `name`, `inspiration`, and `notes`.
    // If multiple terms exist, ensure all are matched by using `$and`, where each term must match at least
    // one of the fields (`name`, `inspiration`, or any entry in the `notes` array).
    const exactFilter = regexTerms.length === 1
      ? {
          $or: [
            { name: regexTerms[0] },
            { inspiration: regexTerms[0] },
            { notes: { $elemMatch: { $regex: regexTerms[0] } } },
          ]
        }
      : {
          $and: regexTerms.map(regex => ({
            $or: [
              { name: regex },
              { inspiration: regex },
              { notes: { $elemMatch: { $regex: regex } } }, 
            ]
          }))
        }

    // Get exact matches first
    const exactMatches = await PerfumeCollection.find(exactFilter).lean()
    
    // If there are enough exact matches for this page, use them (performance optimization)
    const totalExactMatches = await PerfumeCollection.countDocuments(exactFilter)
    const minNeededForPage = sanitizedPage * sanitizedLimit

    if (totalExactMatches >= minNeededForPage) {
      // We have enough exact matches, use standard pagination
      const totalPages = Math.ceil(totalExactMatches / sanitizedLimit)
      const skip = (sanitizedPage - 1) * sanitizedLimit

      const perfumes = await PerfumeCollection.find(exactFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(sanitizedLimit)
        .lean()

      return {
        page: sanitizedPage,
        limit: sanitizedLimit,
        total: totalExactMatches,
        totalPages,
        data: perfumes,
        matchType: 'exact' // Added to indicate match type
      }
    }

    // STEP 2: Not enough exact matches, fall back to fuzzy search
    // Get all perfumes for fuzzy matching 
    const allPerfumes = await PerfumeCollection.find({}).lean()
    
    // Filter with fuzzy matching
    const fuzzyMatches = allPerfumes.filter(perfume => {
      return searchTerms.every(term => {
        // Check name with fuzzy matching
        if (isFuzzyMatch(term, perfume.name || '')) return true
        
        // Check inspiration with fuzzy matching
        if (isFuzzyMatch(term, perfume.inspiration || '')) return true
        
        // Check notes array with fuzzy matching
        if (perfume.notes && perfume.notes.some(note => isFuzzyMatch(term, note))) return true
        
        return false
      })
    })

    // STEP 3: Combine and prioritize results
    // Create a Set of exact match IDs to avoid duplicates
    const exactIds = new Set(exactMatches.map(p => p._id.toString()))
    
    // Get additional fuzzy matches that weren't already found by exact search
    const additionalFuzzyMatches = fuzzyMatches.filter(p => !exactIds.has(p._id.toString()))
    
    // Combine results: exact matches first (higher relevance), then fuzzy matches
    const allMatches = [...exactMatches, ...additionalFuzzyMatches]
    
    // Sort combined results by creation date (newest first)
    allMatches.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Apply pagination to combined results
    const total = allMatches.length
    const totalPages = Math.ceil(total / sanitizedLimit)
    const skip = (sanitizedPage - 1) * sanitizedLimit
    const paginatedPerfumes = allMatches.slice(skip, skip + sanitizedLimit)

    // Return pagination metadata and the array of perfumes for the requested page
    return {
      page: sanitizedPage,
      limit: sanitizedLimit,
      total,
      totalPages,
      data: paginatedPerfumes,
      matchType: 'hybrid', // Indicates both exact and fuzzy matching were used
      exactMatches: exactMatches.length,
      fuzzyMatches: additionalFuzzyMatches.length
    }
  } catch (err) {
    // Log error with stack trace for debugging, then rethrow
    logger.error(`Service error - ${err.message}, { stack: err.stack }`)
    throw err
  }
}

module.exports = {
  addNewPerfumeService,
  fetchAllPerfumesService,
}
