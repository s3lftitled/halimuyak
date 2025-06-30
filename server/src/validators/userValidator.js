const Joi = require('joi')

// 🔐 Register Validator
const registerValidator = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string.',
    'string.email': 'Email must be a valid email address.',
    'string.empty': 'Email is required.',
    'any.required': 'Email is required.',
  }),
  username: Joi.string().min(3).max(40).required().messages({
    'string.base': 'Username must be a string.',
    'string.empty': 'Username is required.',
    'string.min': 'Username must be at least 3 characters long.',
    'string.max': 'Username cannot exceed 40 characters.',
    'any.required': 'Username is required.',
  }),
  password: Joi.string().min(8).max(128)
    .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])'))
    .required()
    .messages({
      'string.base': 'Password must be a string.',
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password cannot exceed 128 characters.',
      'string.pattern.base': 'Password must include both letters and numbers.',
      'any.required': 'Password is required.',
    }),
})

// 🔓 Login Validator
const loginValidator = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string.',
    'string.email': 'Email must be a valid email address.',
    'string.empty': 'Email is required.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password must be a string.',
    'string.empty': 'Password is required.',
    'any.required': 'Password is required.',
  }),
})

module.exports = {
  registerValidator,
  loginValidator,
}
