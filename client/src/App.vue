<template>
  <NavBar />
  <div class="break-time" v-if="isBreakTime">
    <Break 
      :title="`Your ${period} smoking break on ${slot} starts now`"
      :initialTimeLeft="600 - elapsed"
      @break-ended="handleBreakEnded"
    />
  </div>
  <router-view v-else/>
</template>

<script>
import NavBar from './components/NavBar.vue'
import Break from './components/Break.vue'
import { useAuthStore } from './store/modules/authStore'
import { useScheduleStore } from './store/modules/scheduleStore'
import { format } from 'date-fns'
import { onMounted, onUnmounted, ref, watch } from 'vue'

export default {
  components: { NavBar, Break },
  setup() {
    const scheduleStore = useScheduleStore()
    const authStore = useAuthStore()
    const currentTime = ref('')
    const formatToday = ref(format(scheduleStore.today, 'EEE dd/LLL'))

    const isBreakTime = ref(false)
    const period = ref('')
    const slot = ref('')
    const elapsed = ref(0)

    let setTimeInterval

    const startBreakTime = () => {
      const breakStartTime = localStorage.getItem('breakStartTime')
      const storedPeriod = localStorage.getItem('breakPeriod')
      const storedSlot = localStorage.getItem('breakSlot')

      if (breakStartTime && storedPeriod && storedSlot) {
        const secondsElapsed = Math.floor((Date.now() - parseInt(breakStartTime)) / 1000)
        const breakDuration = 600
        if (secondsElapsed < breakDuration) {
          isBreakTime.value = true
          elapsed.value = secondsElapsed
          period.value = storedPeriod
          slot.value = storedSlot
        } else {
          localStorage.removeItem('breakStartTime')
          localStorage.removeItem('breakPeriod')
          localStorage.removeItem('breakSlot')
        }
      }
    }

    const updateCurrentTime = async () => {
      currentTime.value = format(new Date(), 'HH:mm')
      await checkIfBreakTime()
    }

    const checkIfBreakTime = async () => {
      const morningBreak = scheduleStore.selectedDay.selectedSlots.morning
      const afternoonBreak = scheduleStore.selectedDay.selectedSlots.afternoon
      const isMatch = morningBreak === currentTime.value || afternoonBreak === currentTime.value

      if (isMatch) {
        period.value = morningBreak === currentTime.value ? 'morning' : 'afternoon'
        slot.value = morningBreak === currentTime.value ? morningBreak : afternoonBreak
        const now = Date.now()
        localStorage.setItem('breakStartTime', now)
        localStorage.setItem('breakPeriod', period.value)
        localStorage.setItem('breakSlot', slot.value)
        isBreakTime.value = true
        elapsed.value = 0
        await notifyIfBreakStarts(period.value, slot.value)
      }
    }

    const handleBreakEnded = () => {
      isBreakTime.value = false
      localStorage.removeItem('breakStartTime')
    }

    const notifyIfBreakStarts = async (period, time) => {
      let permission = Notification.permission

      if (permission === 'default') {
        permission = await Notification.requestPermission()
      }

      if (permission === 'granted') {
        new Notification(`It's time for your ${period} break: ${time}`)
      } else {
        alert(`It's time for your ${period} break: ${time}`)
      }
    }

    onMounted(async () => {
      await scheduleStore.fetchTodayBreaks(formatToday.value, authStore.user.id)
      startBreakTime()
      updateCurrentTime()
    })

    onUnmounted(() => {
      clearInterval(setTimeInterval)
    })

    watch(() => scheduleStore.hasSchedule, (schedule) => {
      if (schedule) {
        console.log('has schedule in app.vue')
        updateCurrentTime()
        setTimeInterval = setInterval(updateCurrentTime, 60000)
      } else {
        console.log('no schedule in app.vue')
      }
    })

    return {
      scheduleStore,
      period,
      slot,
      currentTime,
      formatToday,
      isBreakTime,
      elapsed,
      handleBreakEnded,
    }
  }
}
</script>

<style>
.break-time {
  display: flex;
  justify-content: center;
}
</style>