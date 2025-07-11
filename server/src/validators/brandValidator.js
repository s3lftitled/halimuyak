const Joi = require('joi')
const mongoose = require('mongoose')

// 🧼 Custom ObjectId Validator
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid')
  }
  return value;
}, 'ObjectId Validation')

// 🧪 Brand Validator Schema
const brandValidator = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Brand name must be a string.',
    'string.empty': 'Brand name is required.',
    'string.min': 'Brand name must be at least 3 characters.',
    'string.max': 'Brand name must not exceed 100 characters.',
    'any.required': 'Brand name is a required field.'
  }),

  logo: Joi.string().allow('').optional().messages({
    'string.base': 'Logo must be a string.'
  }),

  coverImage: Joi.string().allow('').optional().messages({
    'string.base': 'Cover image must be a string.'
  }),

  description: Joi.string().allow('').optional().messages({
    'string.base': 'Description must be a string.'
  }),

  location: Joi.string().allow('').optional().messages({
    'string.base': 'Location must be a string.'
  }),

  established: Joi.string().pattern(/^\d{4}$/).messages({
    'string.pattern.base': 'Established year must be in YYYY format.'
  }),

  rating: Joi.number().min(0).max(5).optional().messages({
    'number.base': 'Rating must be a number.',
    'number.min': 'Rating must be at least 0.',
    'number.max': 'Rating must not exceed 5.'
  }),

  totalReviews: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Total reviews must be a number.',
    'number.integer': 'Total reviews must be an integer.',
    'number.min': 'Total reviews cannot be negative.'
  }),

  followers: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Followers must be a number.',
    'number.integer': 'Followers must be an integer.',
    'number.min': 'Followers cannot be negative.'
  }),

  website: Joi.string().uri().allow('').optional().messages({
    'string.uri': 'Website must be a valid URL.'
  }),

  fragrances: Joi.array()
    .items(objectId)
    .messages({
      'string.base': 'Fragrance ID must be a string.',
      'any.invalid': 'Fragrance ID must be a valid ObjectId.'
    }),

  news: Joi.array().items(
    Joi.object({
      id: Joi.number().integer().required().messages({
        'number.base': 'News ID must be a number.',
        'any.required': 'News ID is required.'
      }),
      title: Joi.string().min(3).max(100).required().messages({
        'string.base': 'News title must be a string.',
        'string.empty': 'News title is required.',
        'string.min': 'News title must be at least 3 characters.',
        'string.max': 'News title must not exceed 100 characters.'
      }),
      date: Joi.string().isoDate().required().messages({
        'string.base': 'Date must be a string.',
        'string.isoDate': 'Date must be in ISO 8601 format (YYYY-MM-DD).',
        'any.required': 'Date is required.'
      }),
      excerpt: Joi.string().allow('').optional().messages({
        'string.base': 'Excerpt must be a string.'
      }),
      image: Joi.string().allow('').optional().messages({
        'string.base': 'Image must be a string.'
      })
    })
  ).optional()
})

// Create PATCH version: make all fields optional
const patchBrandValidator = brandValidator.fork(Object.keys(brandValidator.describe().keys), (field) => field.optional())

module.exports = {
  brandValidator,    // for POST
  patchBrandValidator  // for PATCH
}

