import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useModal = defineStore('modal', () => {
  const showModal = ref(false)

  const toggleModal = () => {
    showModal.value = !showModal.value
  }

  return {
    showModal,
    toggleModal
  }
})
