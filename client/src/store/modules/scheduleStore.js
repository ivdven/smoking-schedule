import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'
import axios from 'axios'

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
    async selectDay(day) {
      const authStore = useAuthStore()
      await this.fetchAllSchedules()
      const userId = authStore.user.id
      this.hasSchedule = this.checkUserHasScheduleForDay(day, userId)

      if (this.hasSchedule) {
        const userSchedule = this.takenSlots.find(
          date => date.dayOfBreak.day === day && date.user._id === userId
        )

        this.selectedDay.selectedSlots.morning = userSchedule.dayOfBreak.morningBreak
        this.selectedDay.selectedSlots.afternoon = userSchedule.dayOfBreak.afternoonBreak
        this.step = 'submit-form';
      } else {
        this.step = 'morning'
      }
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
    },

    checkUserHasScheduleForDay(day, userId) {
      return this.takenSlots.some(date => date.dayOfBreak.day === day && date.user._id === userId);
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
        this.handleSubmitError(err)
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

    async fetchAllSchedules () {
      try {
        const res = await api.get('/getSchedules')
        console.log('schedules: ', res.data)
        this.takenSlots = res.data
        console.log('takenSlots: ', this.takenSlots)
        return res.data
      } catch (err) {
        this.error = err
        console.log('Problem with fetching schedules ', this.error)
      }
    },
    
    handleSubmitError(err) {
      this.isPending = false
      console.error('Error when submitting slots:', err)
    
      if (err.response?.data?.message) {
        this.error = err.response.data.message
      } else {
        this.error = 'An unexpected error occurred. Please try again.'
      }
    
      return err
    }
  },
})