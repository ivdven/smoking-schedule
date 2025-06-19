<template>
  <div class="window">
    <div class="window-title">{{ title }}</div>
    <form @submit.prevent="handleSubmit">
      <fieldset>
        <legend>{{ day || 'No breaks for today' }}</legend>
        <label>Morning slot</label>
        <div>{{ morningSlot || 'Not selected' }}</div>
        <label>Afternoon slot</label>
        <div>{{ afternoonSlot || 'Not selected'}}</div>
      </fieldset>
      <div class="form-actions">
        <div v-if="mode==='view' && context==='DashBoard' && hasSchedule"></div>
        <button v-if="mode==='view' && context==='DashBoard' && !hasSchedule">Select slots</button>
        <button v-if="mode==='view' && context==='ScheduleView' && hasSchedule"
          @click="handleNavigate"
          >Go back
        </button>
        <button v-if="mode==='submit' && context==='ScheduleView' && !hasSchedule">Submit form</button>
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  props: {
    context: String,
    mode: String,
    title: String,
    day: String,
    morningSlot: String,
    afternoonSlot: String,
    hasSchedule: Boolean,
    error: String
  },
  emits: ['go-back', 'submit-slot'],
  setup(props, { emit }) {

    const router = useRouter()

    const handleNavigate = () => {
      emit('go-back')
    }

    const handleSubmit = () => {
      emit('submit-slot', {
        morning: props.morningSlot,
        afternoon: props.afternoonSlot
      })
    }

    return {
      ...props,
      router,
      handleNavigate,
      handleSubmit
    }
  }
}
</script>

<style>
.form-actions {
  margin-top: 7px;
  margin-left: 2px;
}
</style>