<template>
  <div v-if="user">
    <p>Hi, {{ user.firstName }}</p>
  </div>
  <button @click="handleLogOut">log out</button>
</template>

<script>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/modules/authStore'
import { computed } from 'vue'

export default {
  setup() {

    const router = useRouter()
    const authStore = useAuthStore()

    const user = computed(() => authStore.user)
    
    const handleLogOut = async () => {
      authStore.logout()
      router.push({ name: 'LoginView' })
    }
    
    return {
      user,
      handleLogOut
    }
  }
}
</script>

<style>

</style>