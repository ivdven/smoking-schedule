const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    required: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

UserSchema.methods.comparePassword = async (password) => {
  return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', UserSchema)

module.exports = User