// Custom error class extending the built-in Error object
class AppError extends Error {
  constructor(message, statusCode) {
    super(message) // Call parent class (Error) constructor with the error message
    this.statusCode = statusCode // Attach custom HTTP status code
    this.isOperational = true // Flag to distinguish operational errors from programming bugs

    // Captures the stack trace, excluding this constructor from it
    Error.captureStackTrace(this, this.constructor)
  }
}

// Assertion utility function
// Throws an AppError if the provided condition is false
const appAssert = (condition, message, statusCode) => {
  if (!condition) throw new AppError(message, statusCode)
}

// Export the utility for use in other parts of the application
module.exports = { appAssert }
