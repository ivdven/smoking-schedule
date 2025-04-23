const express = require('express')
const { body } = require('express-validator')

const { signUp } = require('../../controllers/auth/signUpController')
const { login } = require('../../controllers/auth/loginController')
const { getProfile } = require('../../controllers/auth/getUserProfile')

const { authenticateToken } = require('../../middlewares/authMiddleware')

const router = express.Router()

router.post('/signup', signUp)
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], (req, res, next) => {
  console.log('Validation middleware triggered')
  next()
}, login)
router.get('/profile', authenticateToken, getProfile)
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'You accessed a protected route', user: req.user })
})


module.exports = router