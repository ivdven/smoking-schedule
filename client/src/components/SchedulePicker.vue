<template>
  <div class="card-container">
    <div v-if="scheduleStore.step === 'selectDay'">
      <WorkWeek
        :context="'SmokingSchedule'"
        :workDays="workDays"
        :getWeekNumber="getWeekNumber"
        :hasSchedule="scheduleStore.hasSchedule"
        />
    </div>

    <div v-if="scheduleStore.step === 'morning'">
      <TimeSlots
        :slots="morningSlots"
        :title="`Pick a morning slot`"
        :takenSlots="takenMorningSlots"
        @go-back="handleGoBack"
        @submit-slot="handleMorningSlotSubmit"
        />
    </div>

    <div v-if="scheduleStore.step === 'afternoon'">
      <TimeSlots
        :slots="afternoonSlots"
        :title="`Pick a afternoon slot`"
        :takenSlots="takenAfternoonSlots"
        @go-back="handleGoBack"
        @submit-slot="handleAfternoonSlotSubmit"
        />
    </div>

    <div v-if="scheduleStore.step === 'submit-form' && !scheduleStore.hasSchedule">
      <DetailCard 
        :mode="'submit'"
        :context="'ScheduleView'"
        :title="`Submit your time slots`"
        :day="scheduleStore.selectedDay.day"
        :morningSlot="scheduleStore.selectedDay.selectedSlots.morning"
        :afternoonSlot="scheduleStore.selectedDay.selectedSlots.afternoon"
        :hasSchedule="scheduleStore.hasSchedule"
        :error="error"
        @go-back="handleGoBack"
        @submit-slot="handleFormSubmit"
      />
    </div>
    <div v-if="scheduleStore.step === 'submit-form' && scheduleStore.hasSchedule">
      <DetailCard 
        :mode="'view'"
        :context="'ScheduleView'"
        :title="`Your selected time slots`"
        :day="scheduleStore.selectedDay.day"
        :morningSlot="scheduleStore.selectedDay.selectedSlots.morning"
        :afternoonSlot="scheduleStore.selectedDay.selectedSlots.afternoon"
        :hasSchedule="scheduleStore.hasSchedule"
        :error="error"
        @go-back="handleGoBack"
        @submit-slot="handleFormSubmit"
      />
    </div>
  </div>
  
</template>

<script>
import DetailCard from './DetailCard.vue'
import WorkWeek from '@/components/WorkWeek.vue'
import TimeSlots from '@/components/TimeSlots.vue'

import { useScheduleStore } from '@/store/modules/scheduleStore'
import { useAuthStore } from '@/store/modules/authStore'
import useTimeSlots from '@/composables/useTimeSlots'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

export default {
  components: {
    DetailCard,
    WorkWeek,
    TimeSlots
  },
  setup() {
    const scheduleStore = useScheduleStore()
    const authStore = useAuthStore()
    const { workDays, morningSlots, afternoonSlots, getWeekNumber  } = useTimeSlots()
    const { error, isPending, takenMorningSlots, takenAfternoonSlots } = storeToRefs(scheduleStore)

    const router = useRouter()
    const userId = ref(authStore.user.id)

    const handleSelectDay = (day) => {
      scheduleStore.selectDay(day, userId.value)
      handleTakenSlots(day)
    }

    const handleTakenSlots = async (day) => {
      scheduleStore.selectedDay.day = day
      await scheduleStore.fetchTakenTimeSlots()
    }

    const handleMorningSlotSubmit = () => {
      scheduleStore.step = 'afternoon'
    }

    const handleAfternoonSlotSubmit = () => {
      scheduleStore.step = 'submit-form'
    }

    const handleFormSubmit = async () => {
      const res = await scheduleStore.handleSlotsSubmit() 
      if (!error.value && res) {
        router.push({ name: 'HomeView' })
      } else {
        console.log('Something went wrong: ', error.value)
      }
    }

    const handleGoBack = () => {
      if (scheduleStore.step === 'morning' || scheduleStore.step === 'submit-form' && scheduleStore.hasSchedule) {
        scheduleStore.resetState()
      }
      if (scheduleStore.step === 'afternoon') {
        scheduleStore.step = 'morning'
      }
      if (scheduleStore.step === 'submit-form') {
        scheduleStore.step = 'afternoon'
      }
    }

    onMounted(() => {
      scheduleStore.resetState()
    })


    return {
      authStore,
      scheduleStore,
      userId,
      workDays,
      getWeekNumber,
      handleSelectDay,
      handleGoBack,
      handleMorningSlotSubmit,
      handleAfternoonSlotSubmit,
      handleFormSubmit,
      handleTakenSlots,
      morningSlots,
      afternoonSlots,
      error,
      isPending,
      takenMorningSlots,
      takenAfternoonSlots
    }
  }
}
</script>

<style>
.card-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

</style>