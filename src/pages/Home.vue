<script setup lang="ts">
import Header from '@/components/Header.vue'
import Modal from '@/components/Modal.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import Button from '@/components/Button.vue'
import { useProjects } from '@/stores/projects'
import { useModal } from '@/stores/modal'
import { storeToRefs } from 'pinia'
import { addProject } from '@/service/addProject'
import { useTodos } from '@/stores/todos'
import { onMounted } from 'vue'

const modal = useModal()
const project = useProjects()
const { projects } = storeToRefs(project)
const { toggleModal, setProjectName } = modal
const { showModal, projectName } = storeToRefs(modal)
const { setTodos } = useTodos()

onMounted(async () => {
  setTodos([])
})

const handleAddProject = () => {
  toggleModal()
  addProject(projectName.value)
  setProjectName('sas')
}
</script>

<template>
  <Header />
  <Button class="bg-[green] py-[12px] px-[24px] rounded w-[100%] text-white" @click="toggleModal">
    Add project
  </Button>
  <h1 class="mt-2 text-[30px] border-b-2">Projects</h1>
  <Modal v-if="showModal">
    <template #form>
      <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add a new project</h3>
      <form class="space-y-3" @submit.prevent="handleAddProject">
        <label
          for="projectName"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Name of the project</label
        >
        <input
          type="text"
          name="projectName"
          id="projectName"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="Add a name"
          required
          v-model.trim="modal.projectName"
        />
        <button
          type="submit"
          class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add
        </button>
      </form>
    </template>
  </Modal>

  <div class="flex flex-wrap gap-4 justify-around mt-2">
    <div v-if="projects.length > 0" v-for="project in projects">
      <ProjectCard :project="project" />
    </div>
    <div v-else>
      <h1 class="text-[#333] text-[20px]">No projects yet</h1>
    </div>
  </div>
</template>
