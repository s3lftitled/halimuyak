const bcrypt = require('bcrypt')
const logger = require('../logger/logger')

/**
 * 🔐 Utility class for hashing and comparing passwords using bcrypt.
 */
class PasswordUtil {
  /**
   * Hashes a plain text password using bcrypt with a salt round of 10.
   * @param {string} password - The plain text password to hash
   * @returns {Promise<string>} The hashed password
   * @throws {Error} If hashing fails
   */
  async hashPassword(password) {
    try {
      return await bcrypt.hash(password, 10)
    } catch (error) {
      logger.error('Error hashing password:', error)
      throw new Error('Failed to hash password.')
    }
  }

  /**
   * Compares a plain password with its hashed counterpart to verify a match.
   * @param {string} plainPassword - The plain text password input
   * @param {string} hashedPassword - The previously hashed password
   * @returns {Promise<boolean>} True if passwords match, false otherwise
   * @throws {Error} If arguments are missing
   */
  async comparePassword(plainPassword, hashedPassword) {
    if (!plainPassword || !hashedPassword) {
      throw new Error('Missing arguments: plainPassword and hashedPassword are required')
    }
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}

module.exports = new PasswordUtil()
