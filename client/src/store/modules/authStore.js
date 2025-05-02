import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api/users',
  headers: { 'Content-Type': 'application/json' }
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      firstName: '',
      lastName: '',
      prefix: '',
      email: '',
      password: '',
    },
    error: null,
    isPending: false,
    isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated')) || false,
    token: localStorage.getItem('token') || null
  }),
  actions: {
    async signUp() {
      this.setLoadingState(true)
      try {
        const res = await api.post('/signup', this.user)
        console.log('Sign up successful')
        this.resetState()
        return res
      } catch (err) {
        this.handleError(err)
      }
    },

    async login(email, password) {
      this.setLoadingState(true)
      try {
        const res = await api.post('/login', { email, password })
        const { token, user } = res.data
        console.log(`Logged in user: ${user.email}`)
        this.setAuthState(token, user)

        return res
      } catch (err) {
        this.handleError(err)
      }
    },

    logout() {
      this.token = null
      this.user = {}
      this.isAuthenticated = false

      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
      this.resetState()
      console.log('User logged out')
    },

    async fetchUserProfile() {
      if (!this.token) {
        this.error = 'No authentication token found'
        return
      }
      this.setLoadingState(true)
      try {
        const res = await api.get('/profile', {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.user = res.data
        localStorage.setItem('user', JSON.stringify(res.data))

        this.resetState()
        return res.data

      } catch (err) {
        this.handleError(err)
      }
    },

    setAuthState(token, user) {
      this.token = token
      this.user = user
      this.isAuthenticated = true

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('isAuthenticated', JSON.stringify(true))
    },

    setLoadingState(value) {
      this.isPending = value
      this.error = null
    },

    resetState() {
      this.isPending = false
      this.error = null
    },

    handleError(err) {
      this.isPending = false
      console.error("Fetch user profile error:", err)
      return err.response?.data?.message ? 
      this.error = err.response.data.message :
      this.error = 'An unexpected error occurred. Please try again.'
    }
  }
})