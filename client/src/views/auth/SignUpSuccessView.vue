<template>
  <div class="window">
    <div class="window-title">Success</div>
    <div class="success-message">
      <p>Your account has been created successfully!</p>
    </div>
    <div class="form-actions">
      <router-link class="button" :to="{ name: 'HomeView' }">Continue</router-link>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    
  }
}
</script>

<style scoped>
.window {
  margin: 220px auto;
}
.success-message {
  background-color: #00FF00;
  color: #000000;
  padding: 5px;
  border: 2px solid #008000;
  box-shadow: inset -2px -2px 0 #80FF80, inset 2px 2px 0 #004000;
  font-family: 'Courier New', Courier, monospace;
  margin: 10px 0;
}
.form-actions {
  display: flex;
  justify-content: center;
}
.button {
  color: #000000;
  text-decoration: none;
}
</style>