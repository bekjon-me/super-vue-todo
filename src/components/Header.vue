<script setup lang="ts">
import Login from '@/pages/Login.vue'
import { useAuth } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const auth = useAuth()
const { user } = storeToRefs(auth)
</script>

<template>
  <header class="flex justify-between items-center mb-2">
    <h2 class="text-[#000] body-font font-poppins text-2xl font-semibold">AdvancedTodo</h2>
    <div class="flex items-center gap-2">
      <h2 class="text-2xl text-[#444] font-poppins font-medium">
        {{ user ? user.username : 'Login' }}
      </h2>
      <img src="../assets/user.jpg" alt="User" class="w-[60px] rounded-full cursor-pointer" />
    </div>
  </header>
</template>
