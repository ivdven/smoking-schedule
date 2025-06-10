const User = require('../../models/auth/User')

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -__v').lean()
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ ...user, id: req.user.userId })
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving profile' })
  }
}

module.exports = { getProfile }