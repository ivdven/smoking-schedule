const User = require('../../models/auth/User')
const bcrypt = require('bcryptjs')

const signUp = async (req, res) => {
  const { firstName, lastName, prefix, email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'This e-mail is already taken by some one else' })
    }

    const username = email
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      username,
      firstName,
      lastName,
      prefix,
      email,
      password: hashedPassword
    })

    await newUser.save()

    res.status(201).json({ message: 'User created successfully' })

  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { signUp }