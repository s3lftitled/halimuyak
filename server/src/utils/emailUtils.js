const nodemailer = require('nodemailer')
const crypto = require('crypto')
const logger = require('../logger/logger')
require('dotenv').config()

// 📧 Email Utility Class
class EmailUtil {
  constructor() {
    // Setup transporter for sending emails using Gmail
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

  // 🔐 Generates a 6-digit hex verification code (e.g., 'a1b2c3')
  async generateVerificationCode() {
    return crypto.randomBytes(3).toString('hex')
  }

  // 📩 Sends a verification email to the user
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
