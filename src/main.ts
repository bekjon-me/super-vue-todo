import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import './index.css'
import 'vue3-audio-player/dist/style.css'
import App from './App.vue'
import router from './router'
import '@vuepic/vue-datepicker/dist/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 2000
} as ToastContainerOptions)

app.mount('#app')
