<template>
  <div class="time-slots-window">
    <div class="time-slots-title">{{ title }}</div>
    <div class="time-slots" v-for="slot in slots" :key="slot">
      <button 
        @click="onSelect(slot)"
        :class="{'taken': isSlotTaken(slot, takenSlots), 'not-taken' : !isSlotTaken(slot, takenSlots)}"
        :disabled="isSlotTaken(slot, takenSlots)"
        >
        {{ slot }}
      </button>
    </div>
    <div class="button-container">
      <button @click="handleNavigator">Go back</button>
      <button @click="handleSubmit" :disabled="!selectedSlot">Submit</button>
    </div>
  </div>
</template>

<script>
import { useScheduleStore } from '@/store/modules/scheduleStore'
import { useAuthStore } from '@/store/modules/authStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'


export default {
  props: {
    slots: Array,
    title: String,
    day: String,
    takenSlots: Array
  },
  emits: ['go-back', 'submit-slot'],
  setup (props, { emit }) {

    const authStore = useAuthStore()
    const scheduleStore = useScheduleStore()
    const { selectSlot } = scheduleStore
    const { selectedDay } = storeToRefs(scheduleStore)

    const selectedSlot = ref(null)

    const onSelect = (slot) => {
      selectedSlot.value = slot
      selectSlot(selectedSlot.value)
    }

    const handleSubmit = (slot) => {
      selectedSlot.value = slot
      emit('submit-slot', selectedSlot.value)
    }

    const handleNavigator = () => {
      emit('go-back')
    }

    const isSlotTaken = (slotTime, slotsTaken) => {
      return slotsTaken.includes(slotTime)
    }

    return {
      selectSlot,
      selectedSlot,
      selectedDay,
      onSelect,
      handleSubmit,
      handleNavigator,
      isSlotTaken,
    }
  }
}

</script>

<style scoped>
.time-slots-container {
  height: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.time-slots-window {
  flex-flow: row wrap;
  width: 500px;
  height: 250px;
  justify-content: space-around;
  align-items: center;
  gap: 7px;
  padding: 10px;
}
.time-slots-title {
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
.button-container {
  display: flex;
  justify-content: space-evenly;
  width: 486px;
  margin-top: auto;
}
.taken {
  color: red;
}
.not-taken {
  color: green
}
.taken,
.disabled {
  background-color: #d3d3d3; /* Light gray background */
  color: red; /* Dark gray text */
  cursor: not-allowed; /* Change cursor to indicate it's not clickable */
  opacity: 0.6; /* Slightly transparent */
}
</style>