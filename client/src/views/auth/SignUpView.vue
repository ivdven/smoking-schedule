<template>
  <div class="window">
    <div class="window-title">Create an account</div>
    <form class="form-container" @submit.prevent="handleSubmit">
      <fieldset>
        <legend>Sign up</legend>
        <label>First name</label>
        <input
          type="text"
          v-model="formData.firstName"
          required
        >
        <div></div>
        <label>Last name</label>
        <input
          type="text"
          v-model="formData.lastName"
          required
        >

        <label>Prefix</label>
        <input
          type="text"
          v-model="formData.prefix"
        >

        <label>E-mail</label>
        <input
          type="text"
          v-model="formData.email"
          required
        >

        <label>Password</label>
        <input
          type="password"
          v-model="formData.password"
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
import useSignUp from '@/composables/useSignUp'
import { useRouter } from 'vue-router'

export default {
  setup() {
    
    const { formData, error, isPending, signUp } = useSignUp()

    const router = useRouter()

    const handleSubmit = () => {
      signUp()
      router.push({ name: 'SignUpSuccessView' })
    }

    return {
      formData,
      error,
      isPending,
      signUp,
      router,
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