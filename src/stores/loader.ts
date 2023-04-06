import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useLoader = defineStore('loader', () => {
  const showLoader = ref(false)

  const setLoader = (value: boolean) => {
    showLoader.value = value
  }

  return {
    showLoader,
    setLoader
  }
})
