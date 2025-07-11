const sanitizeHtml = require('sanitize-html')
const mongoose = require('mongoose')

// ✨ Basic sanitize options: strip all tags and attributes
const sanitizedOpts = {
  allowedTags: [],
  allowedAttributes: {}
}

// Cleans an array of strings: strips HTML and removes empty/invalid items
const cleanArray = (arr) =>
  arr
    .filter((item) => typeof item === 'string')
    .map((n) => sanitizeHtml(n, sanitizedOpts).trim())
    .filter((n) => n.length > 0)

// Sanitizes all string fields in an object
const sanitizeObject = (fields = {}) => {
  if (typeof fields !== 'object' || fields === null || Array.isArray(fields)) {
    throw new Error('sanitizeObject expects a plain object with string values.')
  }

  const sanitized = {}
  for (const [key, value] of Object.entries(fields)) {
    sanitized[key] = typeof value === 'string'
      ? sanitizeHtml(value, sanitizedOpts).trim()
      : '' 
  }

  return sanitized
}

const sanitizeText = (text = '') =>
  typeof text === 'string'
    ? sanitizeHtml(text, sanitizedOpts).trim()
    : ''

const isValidMongoId = (id) => {
  if(!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid MongoDB ObjectId')
  }
}

/** 
  * Sanitize pagination inputs: ensure page and limit are positive numbers within reasonable bounds
  * @param {any} page - The page number to sanitize
  * @param {any} limit - The limit per page to sanitize
  * @returns {{ page: number, limit: number }} Sanitized pagination values
*/
const sanitizePaginationInputs = ( page, limit ) => {
  const sanitizedPage = Number(page) > 0 ? Number(page) : 1
  const sanitizedLimit = Number(limit) > 0 && Number(limit) <= 20 ? Number(limit) : 10

  return { sanitizedPage, sanitizedLimit }
}

module.exports = {
  cleanArray,
  sanitizeObject,
  sanitizeText,
  sanitizedOpts,
  isValidMongoId,
  sanitizePaginationInputs,
}
