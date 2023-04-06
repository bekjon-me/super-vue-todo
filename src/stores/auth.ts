import type { User } from '../models/user'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'

export const useAuth = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const createUser = (createdUser: User) => {
    user.value = createdUser
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('tokens')
    router.push('/login')
    console.log('logout')
  }

  return {
    user,
    createUser,
    logout
  }
})
