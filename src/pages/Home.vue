<script setup lang="ts">
import { withTokenInstance } from '@/api/axios'
import Header from '@/components/Header.vue'
import { useAuth } from '@/stores/auth'
import { LOGIN_USER_URL } from '@/utils/urls'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const auth = useAuth()
const { user } = storeToRefs(auth)
</script>

<template>
  <Header />
  <button class="bg-[green] py-[12px] px-[24px] rounded w-[100%] text-white">Add project</button>
  <h1 class="mt-2 text-[30px] text-[#333] border-b-2">Projects</h1>
</template>
