const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
const authHeader = req.header('Authorization')
const token = authHeader && authHeader.startsWith('Bearer ')
  ? authHeader.split(' ')[1]
  : authHeader
  
if (!token) return res.status(403).json({ message: 'Access denied' })

jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  if (err) return res.status(403).json({ message: 'Invalid token' })
    req.user = user
    next()
})
}

module.exports = { authenticateToken }