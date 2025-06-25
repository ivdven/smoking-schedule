const Schedule = require('../../models/Schedule')

const getUserSchedule = async (req, res) => {
  const { userId, day } = req.query

  if (!userId || !day) {
    res.status(400).json({ error: 'No userId or day found' })
  }

  try {
    const schedule = await Schedule.findOne({ user: userId, 'dayOfBreak.day': day })

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' })
    }
    console.log('Fetched schedule:', schedule)

    return res.json(schedule)

  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { getUserSchedule }