const Joi = require('joi')

const userValidator = Joi.object({
  username: Joi.string()
    .min(3)
    .max(40)
    .required()
    .messages({
      'string.base': 'Username must be a string.',
      'string.empty': 'Username is required.',
      'string.min': 'Username must be at least 3 characters long.',
      'string.max': 'Username cannot exceed 40 characters.',
      'any.required': 'Username is required.',
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email must be a string.',
      'string.email': 'Email must be a valid email address.',
      'string.empty': 'Email is required.',
      'any.required': 'Email is required.',
    }),

})

module.exports = userValidator
