const express = require('express')
const { signUp } = require('../../controllers/auth/signUpController')

const router = express.Router()

router.post('/signup', signUp)

module.exports = router