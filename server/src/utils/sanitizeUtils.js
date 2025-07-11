const sanitizeHtml = require('sanitize-html')
const mongoose = require('mongoose')

/**
 * ✨ Basic sanitize options: strip all tags and attributes
 * @type {{ allowedTags: string[], allowedAttributes: object }}
 */
const sanitizedOpts = {
  allowedTags: [],
  allowedAttributes: {}
}

/**
 * Cleans an array of strings: strips HTML tags and removes empty or invalid entries.
 * @param {any[]} arr - Array of items to clean
 * @returns {string[]} Array of sanitized, non-empty strings
 */
const cleanArray = (arr) =>
  arr
    .filter((item) => typeof item === 'string')
    .map((n) => sanitizeHtml(n, sanitizedOpts).trim())
    .filter((n) => n.length > 0)

/**
 * Sanitizes all string fields in an object by stripping HTML and trimming whitespace.
 * Non-string values are replaced with an empty string.
 * @param {Object.<string, any>} fields - Object with values to sanitize
 * @returns {Object.<string, string>} Object with sanitized string values
 * @throws {Error} If the input is not a plain object
 */
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

/**
 * Sanitizes a single string input by stripping HTML and trimming whitespace.
 * @param {any} text - Text to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeText = (text = '') =>
  typeof text === 'string'
    ? sanitizeHtml(text, sanitizedOpts).trim()
    : ''

/**
 * Checks if a given string is a valid MongoDB ObjectId.
 * @param {string} id - The ID to validate
 * @throws {Error} If the ID is not a valid MongoDB ObjectId
 */
const isValidMongoId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid MongoDB ObjectId')
  }
}

/**
 * Sanitize pagination inputs: ensure page and limit are positive numbers within reasonable bounds.
 * @param {any} page - The page number to sanitize
 * @param {any} limit - The limit per page to sanitize
 * @returns {{ sanitizedPage: number, sanitizedLimit: number }} Sanitized pagination values
 */
const sanitizePaginationInputs = (page, limit) => {
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
