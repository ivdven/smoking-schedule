const Schedule = require('../../models/Schedule')

const getTakenTimeSlots = async (req, res) => {
  const { selectedDay } = req.query
  try {
    const timeSlots = await Schedule.find({ 'dayOfBreak.day': selectedDay })
    res.status(200).json(timeSlots)
  } catch (err) {
    console.error('Error fetching taken time slots:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = { getTakenTimeSlots }