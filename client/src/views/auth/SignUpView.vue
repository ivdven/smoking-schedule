<template>
  <div class="window">
    <div class="window-title">Create an account</div>
    <form class="form-container" @submit.prevent="handleSubmit">
      <fieldset>
        <legend>Sign up</legend>
        <label>First name</label>
        <input
          type="text"
          v-model="user.firstName"
          required
        >
        <div></div>
        <label>Last name</label>
        <input
          type="text"
          v-model="user.lastName"
          required
        >

        <label>Prefix</label>
        <input
          type="text"
          v-model="user.prefix"
        >

        <label>E-mail</label>
        <input
          type="email"
          v-model="user.email"
          required
        >

        <label>Password</label>
        <input
          type="password"
          v-model="user.password"
          required
        >
        
        <div class="form-actions">
          <button v-if="!isPending">Submit</button>
          <button v-else>Submitting...</button>
        </div>
        <div class="error-message" v-if="error">{{ error }}</div>
    </fieldset>
  </form>
</div>
  
</template>

<script>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/modules/authStore'
import { storeToRefs } from 'pinia'

export default {
  setup() {
    
    const authStore = useAuthStore()
    const router = useRouter()

    const { user, error, isPending } = storeToRefs(authStore)

    const handleSubmit = async () => {
      const res = await authStore.signUp()
      if (!authStore.error && res) {
        router.push({ name: 'SignUpSuccessView' })
      } else {
        console.log(`Something went wrong: ${authStore.error}`)
      }
    }

    return {
      user,
      error,
      isPending,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.window {
  margin: 120px auto;
}
.form-actions {
  margin-top: 25px;
}
</style>