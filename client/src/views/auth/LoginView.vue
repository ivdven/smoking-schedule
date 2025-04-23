<template>
  <div class="window">
  <div class="window-title">Welcome friend, please log in or create an account</div>
    <form class="form-container" @submit.prevent="handleSubmit">
      <fieldset>
        <legend>Log in</legend>
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
          <router-link class="button" :to="{ name: 'SignUpView' }">Sign up</router-link>
        </div>
        <div class="error-message" v-if="error">{{ error }}</div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/modules/authStore'

export default {
  setup() {

    const authStore = useAuthStore()
    const { user, error, isPending } = authStore
    const router = useRouter()
    
    const handleSubmit = async () => {
      const res = await authStore.login(user.email, user.password)
      if (!error && res) {
        router.push({ name: 'HomeView' })
      } else {
        console.log('Login failed: ', authStore.error)
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
.button {
  color: #000000;
  text-decoration: none;
}
</style>