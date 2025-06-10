const mongoose = require('mongoose')

const ScheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dayOfBreak: {
    day: {
      type: String,
      required: true
    },
    morningBreak: {
      type: String,
      required: true
    },
    afternoonBreak: {
      type: String,
      required: true
    },
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  
}, { timestamps: true })

const Schedule = mongoose.model('Schedule', ScheduleSchema)

module.exports = Schedule