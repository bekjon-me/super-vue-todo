import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', () => {
  const isUser = ref(false)

  return { isUser }
})
