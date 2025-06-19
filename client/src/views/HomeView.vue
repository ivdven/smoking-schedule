<template>
  <DashBoard :userId="user.id" />
</template>

<script>
import DashBoard from '@/components/DashBoard.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/modules/authStore'
import { computed } from 'vue'

export default {
  components: { DashBoard },
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
      handleLogOut,
      authStore
    }
  }
}
</script>

<style>

</style>