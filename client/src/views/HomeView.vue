<template>
  <p>Hi, {{ authStore.user.email }}</p>
</template>

<script>
import { useAuthStore } from '../store/modules/authStore'

export default {
  setup() {
    
    const authStore = useAuthStore()

    return {
      authStore
    }
  }
}
</script>

<style>

</style>