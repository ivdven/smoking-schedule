const Schedule = require('../../models/Schedule')

const getUsersSchedules = async (req, res) => {
  const { id } = req.params
  try {
    const schedules = await Schedule.find()
      .populate('user')
      .exec()
    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found' })
    }
    return res.json(schedules)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Something went wrong with getting the schedules' })
  }
}

module.exports = { getUsersSchedules }