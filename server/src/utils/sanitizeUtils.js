const sanitizeHtml = require('sanitize-html')

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


module.exports = {
  cleanArray,
  sanitizeObject,
  sanitizeText,
  sanitizedOpts
}
