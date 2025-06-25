<template>
  <div class="nav-bar">
    <h1>Hi, welcome {{ user.firstName || 'Guest' }}</h1>
    <nav>
      <div v-if="user.email" class="nav-window">
        <div class="nav-window-title">
          <router-link class="nav-link" :to="{ name: 'HomeView' }">Home</router-link>
        </div>
      </div>
      <div class="nav-window">
        <div class="nav-window-title">
          <router-link class="nav-link" :to="{ name: 'AboutView' }">About</router-link>
        </div>
      </div>
      <div v-if="user.email">
        <div class="nav-window">
          <div class="nav-window-title">
            <router-link class="nav-link" :to="{ name: 'ScheduleView' }">Smoking schedule</router-link>
          </div>
        </div>
        <div class="nav-window">
          <div class="nav-window-title">
            <button class="nav-link" @click="handleLogOut">Log out</button>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>


<script>
import { useAuthStore } from '@/store/modules/authStore';
import { computed } from 'vue';
import { useRouter } from 'vue-router';


export default {
  setup() {
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)
    const router = useRouter()

    const handleLogOut = async () => {
      console.log('log out')
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

<style scoped>
.nav-bar {
  padding: 25px 25px;
  margin: 60px 0px 0px 20px;
}
.nav-window {
  max-width: 50%;
  max-height: 30px;
  padding: 6px;
  margin-bottom: 10px;
  
}
.nav-window-title {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nav-link,
.nav-link:visited {
  color: #fff;
  text-decoration: none;
}
button.nav-link {
  all: unset;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  display: inline-block;
  text-align: center;
}
</style>