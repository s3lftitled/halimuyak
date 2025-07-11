const nodemailer = require('nodemailer')
const crypto = require('crypto')
const logger = require('../logger/logger')
require('dotenv').config()

/**
 * 📧 Utility class for generating verification codes and sending verification emails using Gmail via Nodemailer.
 */
class EmailUtil {
  constructor() {
    /**
     * Nodemailer transporter configured to use Gmail with credentials from environment variables.
     * @type {import('nodemailer').Transporter}
     */
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
      secure: true,
      pool: true,
      maxConnections: 5,
    })
  }

  /**
   * Generates a 6-character hexadecimal verification code.
   * @returns {Promise<string>} A randomly generated 6-character hex code (e.g., 'a1b2c3')
   */
  async generateVerificationCode() {
    return crypto.randomBytes(3).toString('hex')
  }

  /**
   * Sends a verification email with a verification code to the specified address.
   * @param {string} email - Recipient's email address
   * @param {string} verificationCode - The verification code to include in the email
   * @returns {Promise<void>}
   * @throws {Error} If sending the email fails
   */
  async sendVerificationEmail(email, verificationCode) {
    try {
      const mailOptions = {
        from: process.env.USER,
        to: email,
        subject: 'Verify Your Halimuyak Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #000000;">
            <h2>Welcome to Halimuyak</h2>
            <p>Thank you for creating an account. Enter the verification code below:</p>
            <div style="background-color: #f4f4f4; padding: 12px; text-align: center; font-size: 24px; letter-spacing: 5px;">
              <strong>${verificationCode}</strong>
            </div>
            <p>If you did not request this, please ignore the email.</p>
            <p>– The Halimuyak Team</p>
          </div>
        `,
      }

      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      logger.error('Error sending verification email:', error)
      throw new Error('Failed to send verification email.')
    }
  }
}

module.exports = new EmailUtil()
