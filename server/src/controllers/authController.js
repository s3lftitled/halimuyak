const jwt = require('jsonwebtoken')
const HTTP_STATUS = require('../constants/httpConstants')

exports.googleCallback = (req, res) => {
  const user = req.user;

  // Create JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  // You can also redirect to frontend with the token as a query param
  res.status(HTTP_STATUS.OK).json({ message: 'Logged in with Google', token })
}
