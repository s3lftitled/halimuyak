const sanitizeHtml = require('sanitize-html')

const sanitizedOpts = {
  allowedTags: [],
  allowedAttributes: {}
}

const cleanArray = (arr) =>
  arr
    .filter((item) => typeof item === 'string')
    .map((n) => sanitizeHtml(n, sanitizedOpts).trim())
    .filter((n) => n.length > 0)

const sanitizeText = (text) =>
  typeof text === 'string' ? sanitizeHtml(text, sanitizedOpts).trim() : ''

module.exports = {
  cleanArray,
  sanitizeText,
  sanitizedOpts
}
