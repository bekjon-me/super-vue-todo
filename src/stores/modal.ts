import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Todo } from '@/models/todo'
import type { Project } from '@/models/project'
export const useModal = defineStore('modal', () => {
  const showModal = ref(false)
  const showMainModal = ref(false)
  const projectName = ref('')
  const changingProject = ref()

  const toggleModal = () => {
    showModal.value = !showModal.value
  }

  const toggleMainModal = () => {
    showMainModal.value = !showMainModal.value
  }

  const setProjectName = (name: string) => {
    projectName.value = name
  }

  const setChangingProject = (project: Project) => {
    changingProject.value = project
  }

  return {
    showModal,
    toggleModal,
    projectName,
    setProjectName,
    showMainModal,
    toggleMainModal,
    changingProject,
    setChangingProject
  }
})
