import { useScheduleStore } from "@/store/modules/scheduleStore"
import { startOfWeek, addDays, format, getWeek } from "date-fns"
import { computed } from "vue"

const scheduleStore = useScheduleStore()

const generateTimeSlots = (startHour, endHour) => {
  const slots = []
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += 10) {
      const h = hour.toString().padStart(2, '0')
      const m = min.toString().padStart(2, '0')
      slots.push(`${h}:${m}`)
    }
  }
  return slots
}

const morningSlots = computed(() => generateTimeSlots(8, 12))
const afternoonSlots = computed(() => generateTimeSlots(12, 18))

const workDays = computed(() => {
  const today = scheduleStore.today
  const start = startOfWeek(today, { weekStartsOn: 1 })

  return Array.from({ length: 5 }, (_, i) =>
    format(addDays(start, i), 'EEE dd/LLL')
  )
})

const getWeekNumber = computed(() => getWeek(scheduleStore.today, { weekStartsOn: 1 }))

const useTimeSlots = () => {
  return {
    generateTimeSlots,
    morningSlots,
    afternoonSlots,
    workDays,
    getWeekNumber,
  }
}

export default useTimeSlots