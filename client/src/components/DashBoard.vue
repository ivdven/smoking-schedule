<template>
  <div class="dashboard">
    <div v-if="isWorkDay">
      <div v-if="scheduleStore.hasSchedule" class="today-break">
        <DetailCard
          :context="'DashBoard'"
          :mode="'view'"
          :title="`Today's break`"
          :day="scheduleStore.selectedDay.day"
          :morningSlot="scheduleStore.selectedDay.selectedSlots.morning"
          :afternoonSlot="scheduleStore.selectedDay.selectedSlots.afternoon"
          :hasSchedule="scheduleStore.hasSchedule"
      />
      </div>

      <div class="upcoming-breaks">
        <WorkWeek
          :context="'DashBoard'"
          :workDays="scheduleStore.selectedDays"
          :hasSchedule="scheduleStore.hasSchedule"
          />
      </div>
    </div>

    <div v-else>
      <div class="weekend-message">
        <WeekendMessage />
      </div>
    </div>
  </div>
</template>

<script>
import DetailCard from '@/components/DetailCard.vue'
import WeekendMessage from './WeekendMessage.vue'
import WorkWeek from '@/components/WorkWeek.vue'
import useTimeSlots from '@/composables/useTimeSlots'
import { useScheduleStore } from '@/store/modules/scheduleStore'
import { format } from "date-fns"
import { onMounted, ref, computed } from 'vue'

export default {
  components: { DetailCard, WeekendMessage, WorkWeek },
  props: {
    userId: String,
  },
  setup(props) {

    const scheduleStore = useScheduleStore()
    const { workDays } = useTimeSlots()
    
    const formatToday = ref(format(scheduleStore.today, 'EEE dd/LLL'))

    const isWorkDay = computed(() => {
      return workDays.value.includes(formatToday.value)
    })

    onMounted(async () => {
      scheduleStore.resetState()
      await scheduleStore.fetchTodayBreaks(formatToday.value, props.userId)
      await scheduleStore.fetchUserWeeklySelectedBreaks(props.userId)
      console.log(scheduleStore.selectedDays)
    })

    return {
      scheduleStore,
      formatToday,
      workDays,
      isWorkDay,
      format
    }
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.today-break {
  margin-left: 85px;
  margin-bottom: 20px;
}
</style>