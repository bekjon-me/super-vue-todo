<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { withTokenInstance } from './api/axios'
import { useAuth } from './stores/auth'
import { USER_URL } from './utils/urls'
const { createUser } = useAuth()

onMounted(async () => {
  try {
    const res = await withTokenInstance.get(USER_URL)
    createUser(res.data)
  } catch (error) {
    console.log(error)
  }
})
</script>

<template>
  <RouterView />
</template>

<style>
#app {
  padding: 12px;
}
</style>
