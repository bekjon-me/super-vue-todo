import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Todo } from '@/models/todo'
export const useModal = defineStore('modal', () => {
  const showModal = ref(false)
  const newTodo = ref<Todo>()
  const projectName = ref('')

  const toggleModal = () => {
    showModal.value = !showModal.value
  }

  const setNewTodo = (todo: Todo) => {
    newTodo.value = todo
  }

  const setProjectName = (name: string) => {
    projectName.value = name
  }

  return {
    showModal,
    newTodo,
    projectName,
    toggleModal,
    setProjectName,
    setNewTodo
  }
})
