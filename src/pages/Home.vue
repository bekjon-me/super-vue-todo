<script setup lang="ts">
import Header from '@/components/Header.vue'
import Modal from '@/components/Modal.vue'
import { useAuth } from '@/stores/auth'
import { useProjects } from '@/stores/projects'
import { useModal } from '@/stores/modal'
import { storeToRefs } from 'pinia'

const auth = useAuth()
const modal = useModal()
const project = useProjects()
const { user } = storeToRefs(auth)
const { projects } = storeToRefs(project)
const { toggleModal } = modal
const { showModal } = storeToRefs(modal)
</script>

<template>
  <Header />
  <button class="bg-[green] py-[12px] px-[24px] rounded w-[100%] text-white" @click="toggleModal">
    Add project
  </button>
  <h1 class="mt-2 text-[30px] text-[#333] border-b-2">Projects</h1>
  <Modal v-if="showModal" />

  <div v-for="project in projects">Name of project: {{ project.name }}</div>
</template>
