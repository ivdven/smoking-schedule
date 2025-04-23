import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import pinia from './store/index'

import '@/assets/main.css'

createApp(App).use(pinia).use(router).mount('#app')