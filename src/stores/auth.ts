import type { User } from '../models/user'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const createUser = (createdUser: User) => {
    user.value = createdUser
  }

  return {
    user,
    createUser
  }
})
