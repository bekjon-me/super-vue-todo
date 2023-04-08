import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFilesDownloaded = defineStore('filesDownloaded', () => {
  const filesDownloadedForFirstTime = ref<boolean>(false)

  const setFilesDownloaded = (value: boolean) => {
    filesDownloadedForFirstTime.value = value
  }

  return {
    filesDownloadedForFirstTime,
    setFilesDownloaded
  }
})
