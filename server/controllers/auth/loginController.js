require('dotenv').config()

const User = require('../../models/auth/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const JWT_SECRET = process.env.JWT_SECRET

const login = async (req, res) => {
  try {
  
    const { email, password } = req.body

    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'That user does not exist' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.json({ token, user: { id: user.id, username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName, prefix: user.prefix } })

  } catch (err) {
    console.error('Server Error: ', err)
    res.status(500).json({ message: 'Server Error', error: err.message })
  }
};

module.exports = { login }