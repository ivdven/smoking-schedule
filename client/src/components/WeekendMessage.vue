<template>
  <div class="window">
    <div class="window-title">Weekend message</div>
    <div class="card-container">
      <p>No upcoming breaks, see you on Monday!</p>
      <p>Have a nice weekend!</p>
    </div>
    <div class="button-container">
      <button @click="handleLogOut">Log out</button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/modules/authStore'
import { useRouter } from 'vue-router'

export default {
  setup() {

    const authStore = useAuthStore()
    const router = useRouter()

    const handleLogOut = async () => {
      console.log('log out')
      authStore.logout()
      router.push({ name: 'LoginView' })
    }
    return {
      handleLogOut
    }
  }
}
</script>

<style>
.card-container {
  gap: 0px;
}
</style>