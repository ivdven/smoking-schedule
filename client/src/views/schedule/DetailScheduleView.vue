<template>
  <div class="detail-container">
    <div class="left-arrow">
    <button v-if="canGoBack"
      @click="goToPreviousDay"
    >
      <
    </button>
    </div>

    <div class="detail-card">
      <DetailCard
      :title="`Smoking break`"
      :day="scheduleStore.selectedDay.day"
      :morningSlot="scheduleStore.selectedDay.selectedSlots.morning"
      :afternoonSlot="scheduleStore.selectedDay.selectedSlots.afternoon"
    />
    </div>

    <div class="right-arrow">
      <button v-if="isNextDay"
        @click="goToNextDay"
      >>
      </button>
    </div>
  </div>
</template>

<script>
import DetailCard from '@/components/DetailCard.vue'
import useTimeSlots from '@/composables/useTimeSlots';
import { useScheduleStore } from '@/store/modules/scheduleStore';
import { computed, onMounted, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  components: { DetailCard },
  setup() {
    
    const scheduleStore = useScheduleStore()
    const route = useRoute()
    const router = useRouter()

    const currentIndex = ref(null)

    const isNextDay = computed(() => currentIndex.value < scheduleStore.selectedDays.length - 1)
    const canGoBack = computed(() => currentIndex.value > 0)
    
    const goToNextDay = async () => {
      if (!isNextDay.value) return
      const nextDay = scheduleStore.selectedDays[currentIndex.value + 1]
      await scheduleStore.fetchUserSelectedSchedule(route.query.id, nextDay)
      router.push({ name: 'DetailScheduleView', query: { id: route.query.id, day: nextDay} })
    }

    const goToPreviousDay = async () => {
      if (!canGoBack.value) return
      const prevDay = scheduleStore.selectedDays[currentIndex.value - 1]
      await scheduleStore.fetchUserSelectedSchedule(route.query.id, prevDay)
      router.push({ name: 'DetailScheduleView', query: { id: route.query.id, day: prevDay} })
    }
    
    onMounted(async () => {
      const userId = route.query.id
      const day = route.query.day

      console.log('Before fetch: userId', userId, 'day', day)

      if (userId && day) {
        await scheduleStore.fetchUserSelectedSchedule(userId, day)
        await scheduleStore.fetchUserWeeklySelectedBreaks(userId)

        console.log('After fetch: selectedDays', scheduleStore.selectedDays)
        console.log('After fetch: selectedDay', scheduleStore.selectedDay)
        console.log('isNextDay: ', isNextDay.value)
      }
    })


    watchEffect(() => {
      const selectedDay = scheduleStore.selectedDay.day
      const allDays = scheduleStore.selectedDays

      if (allDays.length && selectedDay) {
        currentIndex.value = allDays.findIndex(d => d === selectedDay)
        console.log('Updated currentIndex:', currentIndex.value)
        console.log('isNextDay:', isNextDay.value)
      }
    })

    return {
      scheduleStore,
      currentIndex,
      canGoBack,
      isNextDay,
      goToNextDay,
      goToPreviousDay
    }
  }
}
</script>

<style>
.detail-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: relative;
}
.detail-card {
  width: 324px;
  flex-shrink: 0;
}
.left-arrow,
.right-arrow {
  position: relative;
  width: 40px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>