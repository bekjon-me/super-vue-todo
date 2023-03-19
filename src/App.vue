<script setup lang="ts">
import { RouterView } from 'vue-router'
import jwt_decode from 'jwt-decode'

const tokens = JSON.parse(localStorage.getItem('tokens') || '{}')
const accessToken = tokens ? tokens.access : null
console.log(jwt_decode(accessToken))
</script>

<template>
  <RouterView />
</template>

<style>
#app {
  padding: 12px;
}
</style>
