<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { withTokenInstance } from './api/axios'
import { useAuth } from './stores/auth'
import { useProjects } from './stores/projects'
import { PROJECTS_URL, USER_URL } from './utils/urls'
const { createUser } = useAuth()
const { setProjects } = useProjects()

onMounted(async () => {
  try {
    const res = await withTokenInstance.get(USER_URL)
    const res2 = await withTokenInstance.get(PROJECTS_URL)
    createUser(res.data)
    setProjects(res2.data)
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
