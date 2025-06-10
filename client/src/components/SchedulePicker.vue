<template>

  <div v-if="scheduleStore.step === 'selectDay'" class="work-days-container">
    <div class="work-days-window">
    <div class="work-days-title">Choose a day this week #{{ getWeekNumber }}</div>
    <div class="date-picker">
      <div class="work-week" v-for="day in workDays" :key="day">
        <button class="work-day" @click="handleSelectDay(day)">{{ day }}</button>
      </div>
    </div>
    </div>
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

  <div v-if="scheduleStore.step === 'submit-form'">
    <div class="window">
      <div class="window-title">Submit your smoking breaks</div>
      <form class="form-container" @submit.prevent="handleSubmit">
        <fieldset>
          <legend>{{ scheduleStore.selectedDay.day }}</legend>
          <label>Morning slot</label>
          <div>{{ scheduleStore.selectedDay.selectedSlots.morning }}</div>
          <label>Afternoon slot</label>
          <div>{{ scheduleStore.selectedDay.selectedSlots.afternoon }}</div>
        </fieldset>
        <div v-if="!scheduleStore.hasSchedule" class="form-actions">
          <button @click="handleGoBack">Go back</button>
          <button>Submit</button>
        </div>
        <div v-else>
          <button @click="handleGoToHome">Go back</button>
        </div>
        <div class="error-message" v-if="error">{{ error }}</div>
      </form>
    </div>
  </div>

</template>

<script>
import TimeSlots from '@/components/TimeSlots.vue'

import { useScheduleStore } from '@/store/modules/scheduleStore'
import { useAuthStore } from '@/store/modules/authStore'
import useTimeSlots from '@/composables/useTimeSlots'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

export default {
  components: {
    TimeSlots
  },
  setup() {
    const scheduleStore = useScheduleStore()
    const authStore = useAuthStore()
    const { workDays, morningSlots, afternoonSlots, getWeekNumber  } = useTimeSlots()
    const { error, isPending, takenMorningSlots, takenAfternoonSlots } = storeToRefs(scheduleStore)

    const router = useRouter()

    const handleSelectDay = (day) => {
      scheduleStore.selectDay(day)
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

    const handleSubmit = async () => {
      const res = await scheduleStore.handleSlotsSubmit() 
      if (!error.value && res) {
        router.push({ name: 'HomeView' })
      } else {
        console.log('Something went wrong: ', error.value)
      }
    }

    const handleGoBack = () => {
      if (scheduleStore.step === 'morning') {
        scheduleStore.step = 'selectDay'
        scheduleStore.resetState()
      }
      if (scheduleStore.step === 'afternoon') {
        scheduleStore.step = 'morning'
      }
      if (scheduleStore.step === 'submit-form') {
        scheduleStore.step = 'afternoon'
      }
    }

    const handleGoToHome = () => {
      router.push({ name: 'HomeView' })
      scheduleStore.resetState()
    }


    return {
      authStore,
      scheduleStore,
      workDays,
      getWeekNumber,
      handleSelectDay,
      handleGoBack,
      handleMorningSlotSubmit,
      handleAfternoonSlotSubmit,
      handleSubmit,
      handleTakenSlots,
      handleGoToHome,
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

<style scoped>
.work-days-container {
  height: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.work-days-window {
  flex-flow: row wrap;
  width: 500px;
  height: 250px;
  justify-content: space-around;
  align-items: center;
  gap: 7px;
  padding: 10px;
}
.work-days-title {
  align-self: center;
  text-align: center;
  flex-basis: 486px;
}
.date-picker {
  display: flex;
  align-items: center;
  width: 500px;
  justify-content: space-between;
  margin-bottom: 20px;
}
.work-days-window {
  height: 120px;
}
.work-days-title {
  margin-bottom: auto;
}
</style>