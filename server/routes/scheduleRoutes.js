const express = require('express')

const { getTakenTimeSlots } = require('../controllers/schedule/getTakenSlotsController')
const { getUsersSchedules } = require('../controllers/schedule/getUsersSchedules')
const { submitSchedule } = require('../controllers/schedule/submitController')

const { authenticateToken } = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/getSchedules', getUsersSchedules)
router.get('/get-taken-slots', getTakenTimeSlots)
router.post('/submit', authenticateToken, submitSchedule)

module.exports = router