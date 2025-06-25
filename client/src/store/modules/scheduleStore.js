import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'
import axios from 'axios'
import { isAfter, parse, isEqual, startOfDay } from 'date-fns'

const api = axios.create({
  baseURL: 'http://localhost:3000/api/schedules',
  headers: { 'Content-Type': 'application/json' }
})

export const useScheduleStore = defineStore('schedules', {

  state: () => ({
    selectedDays: [],
    selectedDay: {
      day: null,
      selectedSlots: {
        morning: null,
        afternoon: null
      },
    },
    takenSlots: [],
    takenMorningSlots: [],
    takenAfternoonSlots: [],
    hasSchedule: false,
    step: 'selectDay',
    today: new Date(),
    error: null,
    isPending: false,
    token: localStorage.getItem('token') || null
  }),

  actions: {
    async selectDay(day, userId) {
      await this.fetchTodayBreaks(day, userId)
    },
    
    selectSlot(slot) {
      if (this.selectedDay.day != null && this.step === 'morning') {
        this.selectedDay.selectedSlots.morning = slot
      } else if (this.selectedDay.day != null && this.step === 'afternoon') {
        this.selectedDay.selectedSlots.afternoon = slot
      }
    },
    resetState() {
      this.selectedDay = {
        day: null,
        selectedSlots: {
          morning: null,
          afternoon: null
        }
      }
      this.step = 'selectDay'
      this.hasSchedule = false
      this.error = null
    },

    async checkUserHasScheduleForDay(day, userId) {
      try {
        await this.fetchAllSchedules()
        this.hasSchedule = this.takenSlots.some(date => date.dayOfBreak.day === day && date.user._id === userId)
      } catch (err) {
        this.handleError(err)
      }
    },

    async fetchTodayBreaks(day, userId) {
      try {
        await this.checkUserHasScheduleForDay(day, userId)
    
        if (this.hasSchedule) {
          const userSchedule = this.takenSlots.find(
            date => date.dayOfBreak.day === day && date.user._id === userId
          )
    
          if (userSchedule) {
            this.selectedDay.day = userSchedule.dayOfBreak.day
            this.selectedDay.selectedSlots.morning = userSchedule.dayOfBreak.morningBreak
            this.selectedDay.selectedSlots.afternoon = userSchedule.dayOfBreak.afternoonBreak
            this.step = 'submit-form'
          }
        } else {
          this.selectedDay.selectedSlots.morning = 'No slot selected'
          this.selectedDay.selectedSlots.afternoon = 'No slot selected'
          this.step = 'morning'
        }
    
        console.log('Returning hasSchedule:', this.hasSchedule)
        return this.hasSchedule
      } catch (err) {
        console.error('Error in fetchTodayBreaks:', err)
        this.handleError(err)
        return false
      }
    }
    ,

    async fetchUserWeeklySelectedBreaks(userId) {
      try {
        await this.fetchAllSchedules()

        const today = this.today
        const currentYear = today.getFullYear()
        const todayStart = startOfDay(today)

        const parseDayString = (str) => {
          if (typeof str !== 'string') return null
          const fullStr = `${str}/${currentYear}`
          return parse(fullStr, 'EEE dd/LLL/yyyy', new Date())
        }

        console.log('All slots:', this.takenSlots)

        const upcomingBreaks = this.takenSlots
          .filter(slot => {
            const isUserMatch = slot.user._id === userId
            const dayStr = slot.dayOfBreak?.day

            if (!isUserMatch || typeof dayStr !== 'string') return false

            const slotDate = parseDayString(dayStr)
            if (!slotDate) return false

            return isAfter(slotDate, todayStart) || isEqual(slotDate, todayStart)
          })
          .map(slot => slot.dayOfBreak.day)

        this.selectedDays = [...new Set(upcomingBreaks)]

        console.log('Filtered days:', upcomingBreaks)

      } catch (err) {
        this.handleError(err)
        this.selectedDays = []
      }
    },


    async handleSlotsSubmit() {
      const { day, selectedSlots } = this.selectedDay

      let payload = null

      if (day && selectedSlots.morning && selectedSlots.afternoon) {
        payload = {
          dayOfBreak: {
            day,
            morningBreak: selectedSlots.morning,
            afternoonBreak: selectedSlots.afternoon
          }
        }
      }
      
      if (!payload) {
        console.log('Payload is undefined :', payload)
        return
      }

      try {
        console.log('payload: ', payload)
        console.log(this.token)
        const res = await api.post('/submit', payload, { headers: { Authorization: `Bearer ${this.token}` }})
        console.log(res.data)
        this.resetState()
        return res
         
      } catch (err) {
        this.handleError(err)
        throw err
      }
    },

    async fetchTakenTimeSlots () {

      try {
        const res = await api.get(`/get-taken-slots?selectedDay=${this.selectedDay.day}`)
        this.takenSlots = res.data
        
        this.takenMorningSlots = this.takenSlots
          .map(slot => slot?.dayOfBreak?.morningBreak)
          .filter(Boolean)
          
        this.takenAfternoonSlots = this.takenSlots
          .map(slot => slot?.dayOfBreak?.afternoonBreak)
          .filter(Boolean)

      } catch (err) {
        this.error = err
        console.error('Error fetching taken slots:', err)
      }
    },

    async fetchUserSelectedSchedule (userId, day) {
      try {
        const res = await api.get('/getSchedule', {
          params: { userId, day }
        })
        const dayOfBreak = res.data?.dayOfBreak || {}

        this.selectedDay.day = dayOfBreak.day || null
        this.selectedDay.selectedSlots.morning = dayOfBreak.morningBreak || null
        this.selectedDay.selectedSlots.afternoon = dayOfBreak.afternoonBreak || null

        console.log('selectedDay:', this.selectedDay)

        return this.selectedDay
        
      } catch (err) {
        this.handleError(err)
      }
    },

    async fetchAllSchedules () {
      try {
        const res = await api.get('/getSchedules')
        console.log('schedules: ', res.data)
        this.takenSlots = res.data
        console.log('takenSlots: ', this.takenSlots)
        return res.data
      } catch (err) {
        this.handleError(err)
        console.log('Problem with fetching schedules ', this.error)
      }
    },
    
    handleError(err) {
      this.isPending = false
      console.error('Error: ', err)
    
      if (err.response?.data?.message) {
        this.error = err.response.data.message
      } else {
        this.error = 'An unexpected error occurred. Please try again.'
      }
    
      return err
    }
  },
})