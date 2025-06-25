<template>
  <div class="window">
    <div class="window-title">{{ title }}</div>
    <div class="smoking-container">
      <fieldset>
        <legend class="timer">{{ formattedTime }}</legend>
        <img :src="currentImage" alt="cigarette" class="cigarette-sprite">
      </fieldset>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, computed } from 'vue'

export default {
  props: {
    title: String,
    initialTimeLeft: {
      type: Number,
      default: 600
    }
  },
  setup(props, { emit }) {
    const totalSeconds = 600
    const totalFrames = 9
    const framePerSecond = totalSeconds / totalFrames
    const currentFrame = ref(1)
    const timeLeft = ref(props.initialTimeLeft)
    const formattedTime = ref('10:00')
    const smokeToggle = ref(true)

    let countdownInterval, burnProgress, smokeInterval

    const currentImage = computed(() => {
      const frame = currentFrame.value
      if (frame === totalFrames) return require(`@/assets/cigarette/frame_5.png`)
      const baseNumber = Math.ceil(frame / 2)
      const suffix = smokeToggle.value ? 'a' : 'b'
      return require(`@/assets/cigarette/frame_${baseNumber}${suffix}.png`)
    })

    const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60)
      const s = seconds % 60
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }

    const updateTimer = () => {
      timeLeft.value = Math.max(timeLeft.value - 1, 0)
      formattedTime.value = formatTime(timeLeft.value)
    }

    const burnTimer = () => {
      if (currentFrame.value < totalFrames - 1) currentFrame.value++
      else clearInterval(burnProgress)
    }

    onMounted(() => {
      formattedTime.value = formatTime(timeLeft.value)
      countdownInterval = setInterval(() => {
        updateTimer()
        if (timeLeft.value <= 0) {
          clearInterval(countdownInterval)
          emit('break-ended')
        }
      }, 1000)

      burnProgress = setInterval(burnTimer, framePerSecond * 2000)
      smokeInterval = setInterval(() => { smokeToggle.value = !smokeToggle.value }, 900)
    })

    onUnmounted(() => {
      clearInterval(countdownInterval)
      clearInterval(burnProgress)
      clearInterval(smokeInterval)
    })

    return {
      formattedTime,
      currentImage,
    }
  }
}
</script>

<style scoped>
.window {
  min-height: 275px;
}
.smoking-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cigarette-sprite {
  width: 200px;
  image-rendering: pixelated;
}
.timer {
  margin-top: 8px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  background: #222;
  color: #0f0;
  padding: 4px 8px;
}
legend {
  margin-left: auto;
}
</style>
