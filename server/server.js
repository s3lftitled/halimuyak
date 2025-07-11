// Import required packages and modules
const express = require('express')                    // Web framework for handling HTTP requests
const cors = require('cors')                          // Middleware for enabling Cross-Origin Resource Sharing
const cookieParser = require('cookie-parser')         // Middleware to parse cookies from requests
require('dotenv').config()                            // Loads environment variables from a .env file

// Import custom modules
const connectDB = require('./src/config/db')          // Function to connect to MongoDB
const logger = require('./src/logger/logger')         // Custom logger for logging info and errors
const passport = require('./src/config/passport')     // Passport config for authentication
const errorHandler = require('./src/middlewares/errorHandler') // Global error handler middleware

// Import routers
const perfumeRouter = require('./src/routers/perfumeRouter')  // Routes for perfume-related endpoints
const authRouter = require('./src/routers/authRouter')        // Routes for authentication
const brandRouter = require('./src/routers/brandRouter')      // Routes for brand-related endpoints

// Initialize the Express app
const app = express()

// Initialize Passport (used for authentication strategies)
app.use(passport.initialize())

// Set server port from environment variable or use default 5001
const port = process.env.PORT || 5001

// Middleware to parse incoming JSON and URL-encoded data with high size limits
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb', parameterLimit: 1000000 }))

// Configure CORS to allow frontend to make requests to backend
const corsOptions = {
  origin: process.env.CLIENT,                      // Allowed origin (frontend)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',       // Allowed HTTP methods
  credentials: true,                               // Enable cookies and credentials sharing
  optionsSuccessStatus: 204,                       // For legacy browser support
}
app.use(cors(corsOptions))                          // Apply CORS settings

// Parse cookies from incoming requests
app.use(cookieParser())

app.use(logger.logRequest)

// Health check endpoint to verify server is running
app.get('/health-check', (req, res) => {
  res.send('server is healthy!!')
})

// Route middlewares
app.use('/api/perfumes', perfumeRouter)             // Handle routes starting with /api/perfumes
app.use('/api/auth', authRouter)                    // Handle routes starting with /api/auth
app.use('/api/brands', brandRouter)                 // Handle routes starting with /api/brands

// Global error-handling middleware
app.use(errorHandler)

// Function to start the server
const start = async () => {
  try {
    // Attempt to connect to MongoDB
    await connectDB()

    // Start the Express server after DB connection is successful
    app.listen(port, () => {
      logger.info(`✅ Server is now listening on port ${port}`)
    })
  } catch (error) {
    // Log any error encountered during startup
    logger.logError(`🚫 Error starting server ${error.message}`)
  }
}

// Invoke the start function to launch the app
start()
