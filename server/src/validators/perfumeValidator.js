const Joi = require('joi');

const perfumeSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'Name must be a text.',
      'string.empty': 'Name is required.',
      'string.min': 'Name must be at least 3 characters.',
      'string.max': 'Name must not exceed 50 characters.',
      'any.required': 'Name is a required field.'
    }),

  notes: Joi.alternatives()
    .try(
      Joi.string().messages({
        'string.base': 'Notes must be a string.',
        'string.empty': 'Notes cannot be empty.'
      }),
      Joi.array().items(
        Joi.string().min(1).messages({
          'string.min': 'Each note must be at least 1 character.'
        })
      )
    )
    .required()
    .messages({
      'any.required': 'Notes are required.',
      'alternatives.match': 'Notes must be a string or an array of strings.'
    }),

  image: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!value.startsWith('http') && !value.includes('uploads/')) {
        return helpers.error('image.invalid');
      }
      return value;
    }, 'Image URL or Path Validation')
    .messages({
      'string.base': 'Image must be a string.',
      'string.empty': 'Image URL is required.',
      'any.required': 'Image is a required field.',
      'image.invalid': 'Image must be a valid URL or contain "uploads/".'
    }),

  links: Joi.object({
    shopee: Joi.string()
      .uri({ scheme: ['https'] })
      .allow('')
      .optional()
      .messages({
        'string.uri': 'Shopee link must be a valid HTTPS URL.'
      }),
    lazada: Joi.string()
      .uri({ scheme: ['https'] })
      .allow('')
      .optional()
      .messages({
        'string.uri': 'Lazada link must be a valid HTTPS URL.'
      }),
    tiktok: Joi.string()
      .uri({ scheme: ['https'] })
      .allow('')
      .optional()
      .messages({
        'string.uri': 'TikTok link must be a valid HTTPS URL.'
      })
  }).optional(),

  inspiration: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'Inspiration must be a string.',
      'string.empty': 'Inspiration is required.',
      'string.min': 'Inspiration must be at least 3 characters.',
      'string.max': 'Inspiration must not exceed 50 characters.',
      'any.required': 'Inspiration is a required field.'
    })
});

module.exports = perfumeSchema;
