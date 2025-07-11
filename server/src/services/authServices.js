// Import dependencies and utilities
const UserCollection = require('../models/userModel') // Mongoose model for the User collection
const { registerValidator, loginValidator } = require('../validators/userValidator') // Joi validators
const HTTP_STATUS = require('../constants/httpConstants') // Custom HTTP status codes
const { appAssert } = require('../utils/appAssert') // Custom assertion utility for error handling
const { sanitizeText, sanitizeObject } = require('../utils/sanitizeUtils') // Utility to clean input text
const EmailUtil = require('../utils/emailUtils') // Utilities for email-related operations
const PasswordUtil = require('../utils/passwordUtils') // Utilities for password hashing and comparison
const { generateTokens } = require('../middlewares/jsonWebTokens') // Function to generate JWT access and refresh tokens

/**
 * Registers a new user.
 *
 * @param {string} email - The user's email address.
 * @param {string} username - The user's desired username.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} The newly created user object.
 * @throws Will throw an error if validation fails or the user already exists.
 */
const registerUserService = async (email, username, password) => {
  try {
    // Sanitize the username to remove unwanted characters
    const sanitizedUsername  = sanitizeText(username)
    
    // Construct cleaned user data
    const rawData = {
      email,
      sanitizedUsername,
      password
    }

    // Validate user input using Joi schema
    const { error, value } = registerValidator.validate(rawData)
    appAssert(!error, error?.message || 'Invalid input data', HTTP_STATUS.BAD_REQUEST)

    // Check if user already exists with the provided email
    const existingUser = await UserCollection.findOne({ email: value.email })
    appAssert(!existingUser, 'User with this email already exists', HTTP_STATUS.BAD_REQUEST)

    // Hash the user's password securely
    const hashedPassword = await PasswordUtil.hashPassword(value.password)

    // Generate a verification code for email verification
    const verificationCode = await EmailUtil.generateVerificationCode()

    // Send verification email to the user
    await EmailUtil.sendVerificationEmail(value.email, verificationCode)

    // Set expiration to 30 minutes from now
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000)

    // Create the new user in the database
    const [newUser] = await UserCollection.create([
      {
        username: value.username,
        email: value.email,
        password: hashedPassword,
        verificationCode,
        verificationCodeExpiresAt: expiresAt
      }
    ])

    // Return the newly created user
    return newUser
  } catch (error) {
    // Propagate any caught error
    throw error
  }
}

/**
 * Verifies a user's email using the verification code sent to their inbox.
 *
 * @param {string} email - The user's email address.
 * @param {string} verificationCode - The code sent to the user's email.
 * @returns {Promise<Object>} A success message object.
 * @throws Will throw an error if verification fails or the code is expired.
 */
const verifyEmailService = async (email, verificationCode) => {
  try {
    // Sanitize email and verification code to remove HTML or malicious input
    const { email: cleanEmail, verificationCode: cleanCode } = sanitizeObject({ email, verificationCode })

    const user = await UserCollection.findOne({
      email: cleanEmail,
      verificationCode: cleanCode
    })

    // If user not found or code expired
    appAssert(user, 'Invalid verification code or email', HTTP_STATUS.NOT_FOUND)
    appAssert(user.verificationCodeExpiresAt > new Date(), 'Verification code expired', HTTP_STATUS.BAD_REQUEST)

    // Try to find and update the user in a single atomic operation
    const result = await UserCollection.updateOne(
      {
        email: cleanEmail,    
        verificationCode: cleanCode
      },
      {
        $set: {
          isVerified: true,       // Mark the user as verified
          verificationCode: null,  // Clear the verification code after use
          verificationCodeExpiresAt: null  // Clear the verification code expiration
        }
      }
    )

    // If no user was updated, the code or email is invalid
    appAssert(result.modifiedCount > 0, 'Invalid verification code or email', HTTP_STATUS.NOT_FOUND)

    // Return success message if update was successful
    return { message: 'Email successfully verified' }
  } catch (error) {
    // Propagate any error to be handled by calling code or global error handler
    throw error
  }
}

/**
 * Logs in a user by validating credentials and returning JWT tokens.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<{ user: Object, accessToken: string, refreshToken: string }>} Authenticated user and tokens.
 * @throws Will throw an error if login credentials are invalid.
 */
const logInService = async (email, password) => {
  try {
    // Construct login input
    const rawData = { email, password }

    // Validate the input using Joi schema
    const { error, value } = loginValidator.validate(rawData)
    appAssert(!error, error?.message || 'Invalid input data', HTTP_STATUS.BAD_REQUEST)

    // Find user by email
    const user = await UserCollection.findOne({ email: value.email })
    appAssert(user, 'No user is associated with that email', HTTP_STATUS.NOT_FOUND)

    // Compare input password with hashed password stored in DB
    const isPasswordCorrect = await PasswordUtil.comparePassword(value.password, user.password)
    appAssert(isPasswordCorrect, 'Password is incorrect', HTTP_STATUS.BAD_REQUEST)

    // Generate JWT access and refresh tokens for the user
    const tokens = generateTokens(user)
    const { accessToken, refreshToken } = tokens

    // Return authenticated user and tokens
    return { user, accessToken, refreshToken }
  } catch (error) {
    // Propagate any caught error
    throw error
  }
}

// Export services to be used in controllers
module.exports = {
  registerUserService,
  verifyEmailService,
  logInService,
}
