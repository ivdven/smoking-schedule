import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/modules/authStore'
import { jwtDecode } from 'jwt-decode'

import HomeView from '../views/HomeView.vue'

import SignUpView from '@/views/auth/SignUpView'
import SignUpSuccessView from '@/views/auth/SignUpSuccessView'
import LoginView from '@/views/auth/LoginView'

function isTokenExpired(token) {
  if (!token) return true
  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch (err) {
    console.log(err.message)
    return true
  }
}

const routes = [
  {
    path: '/dashboard',
    name: 'HomeView',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'AboutView',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/schedule-view',
    name: 'ScheduleView',
    component: () => import('@/views/schedule/ScheduleView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/schedule-detail',
    name: 'DetailScheduleView',
    component: () => import('@/views/schedule/DetailScheduleView.vue'),
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/signup',
    name: 'SignUpView',
    component: SignUpView
  },
  {
    path: '/signup-success',
    name: 'SignUpSuccessView',
    component: SignUpSuccessView
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth) {
    if (!authStore.token || !authStore.isAuthenticated || isTokenExpired(authStore.token)) {
      return next({ name: 'LoginView' })
    }
    if (!authStore.user?.email) {
      try {
        await authStore.fetchUserProfile()
      } catch (err) {
        console.log(err)
        authStore.logout()
        return next({ name: 'LoginView' })
      }
    }
  }
  next()
})

export default router
