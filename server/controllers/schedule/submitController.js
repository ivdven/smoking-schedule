const Schedule = require('../../models/Schedule')

const submitSchedule = async (req, res) => {
  const { day, morningBreak, afternoonBreak } = req.body.dayOfBreak
  const userId = req.user.userId

  console.log('day: ', day)
  console.log('morningbreak: ', morningBreak)
  console.log('afternoonBreak: ', afternoonBreak)
  console.log('userId: ', userId)

  if (!userId || !day || !morningBreak || !afternoonBreak) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const schedule = new Schedule({
      user: userId,
      dayOfBreak: {
        day,
        morningBreak,
        afternoonBreak
      }
    })

    await schedule.save()

    res.status(201).json({ message: 'Schedule submitted successfully' })

  } catch (err) {
    console.error('Failed to save schedule:', err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

module.exports = { submitSchedule }