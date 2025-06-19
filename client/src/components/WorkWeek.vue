<template>
  <div v-if="context==='SmokingSchedule'">
    <div class="work-days-container">
      <div class="work-days-window">
      <div class="work-days-title">Choose a day this week #{{ getWeekNumber }}</div>
        <div class="date-picker">
        <div class="work-week" v-for="day in workDays" :key="day">
        <button class="work-day" @click="handleSelectDay(day)">{{ day }}</button>
        </div>
      </div>
      </div>
    </div>
  </div>
  <div v-if="context==='DashBoard'">
    <div class="work-days-container">
      <div class="work-days-window">
        <div class="work-days-title">Upcoming breaks this week</div>
        <div v-if="hasSchedule" class="date-picker">
          <div  class="work-week" v-for="day in workDays" :key="day">
            <button class="work-day" @click="handleSelectDay(day)">{{ day }}</button>
          </div>
        </div>
        <div v-else class="not-selected">
          <fieldset>
            <p>You have no breaks selected yet</p>
          </fieldset>
          <div class="button-container">
            <button @click="handleNavigate">Select slots</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/modules/authStore'
import { useScheduleStore } from '@/store/modules/scheduleStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  props: {
    workDays: Array,
    getWeekNumber: Number,
    context: String,
    hasSchedule: Boolean
  },
  setup(props) {
    const authStore = useAuthStore()
    const scheduleStore = useScheduleStore()

    const userId = ref(authStore.user.id)

    const router = useRouter()

    console.log(userId)

    const handleSelectDay = (day) => {
      if (props.context === 'SmokingSchedule') {
        scheduleStore.selectDay(day, userId.value)
        handleTakenSlots(day)
      } else if (props.context === 'DashBoard') {
        handleGoToDay(day)
      }
    }

    const handleGoToDay = async (day) => {
      scheduleStore.selectedDay.day = day
      await scheduleStore.fetchTodayBreaks(scheduleStore.selectedDay.day, userId.value)
      router.push({ name: 'DetailScheduleView', query: { id: userId.value, day: scheduleStore.selectedDay.day} })
    }

    const handleTakenSlots = async (day) => {
      scheduleStore.selectedDay.day = day
      await scheduleStore.fetchTakenTimeSlots()
    }

    return {
     ...props,
     authStore,
     scheduleStore,
     userId,
     handleSelectDay,
     handleTakenSlots,
     handleGoToDay
    }
  }
}

</script>

<style scoped>
.work-days-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.work-days-window {
  display: flex;
  flex-direction: column;
  flex-flow: wrap;
  width: 500px;
  justify-content: flex-start;
  align-items: center;
  gap: 7px;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto;
}
.work-days-title {
  flex-basis: 486px;
  text-align: center;
  margin-bottom: auto;
}
.date-picker {
  display: flex;
  align-items: center;
  width: 500px;
  justify-content: space-between;
  margin-bottom: 20px;
}
.date-picker button {
  margin-top: 12px;
}
.not-selected {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  flex: 1;
  gap: 8px
}
.not-selected fieldset {
  width: 486px;
  box-sizing: border-box;
}
/* .not-selected .button-container {
  display: flex;

} */
</style>