<script setup lang="ts">
import Loader from './components/MainLoader.vue'
import { storeToRefs } from 'pinia'
import { RouterView } from 'vue-router'
import { useLoader } from './stores/loader'
import { onMounted } from 'vue'
import { withTokenInstance } from './api/axios'
import { PROJECTS_URL, USER_URL } from './utils/urls'
import { useAuth } from './stores/auth'
import { useProjects } from './stores/projects'

const auth = useAuth()
const loader = useLoader()
const { setLoader } = loader
const { showLoader } = storeToRefs(loader)
const { createUser } = auth
const { setProjects } = useProjects()

const fetchData = async () => {
  try {
    setLoader(true)
    const res = await withTokenInstance.get(USER_URL)
    createUser(res.data)
    const res2 = await withTokenInstance.get(PROJECTS_URL)
    setProjects(res2.data)
  } catch (error) {
    console.log(error)
  } finally {
    setLoader(false)
  }
}

onMounted(async () => {
  fetchData()
})
</script>

<template>
  <RouterView v-if="!showLoader" />
  <Loader v-else />
</template>

<style>
#app {
  padding: 12px;
}
</style>
