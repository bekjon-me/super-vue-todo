<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { PROJECTS_URL } from '@/utils/urls'
import { withTokenInstance } from '@/api/axios'
import doThis from '@/assets/dothis.jpg'
import FileLoader from '@/components/FileLoader.vue'
import type { Todo } from '@/models/todo'
import { useFilesDownloaded } from '@/stores/filesDownloaded'
import { storeToRefs } from 'pinia'
import AudioPlayer from 'vue3-audio-player'
import axios from 'axios'

const source = axios.CancelToken.source()
const props = defineProps<{
  todo: Todo
}>()
const { setFilesDownloaded } = useFilesDownloaded()
const { filesDownloadedForFirstTime } = storeToRefs(useFilesDownloaded())
const { params } = useRoute()
const { id } = params

const file = ref('')
const loading = ref(false)
const attachedIs = ref('video')

const forceFileDownload = async (response: any) => {
  const url = window.URL.createObjectURL(response)
  file.value = url
  checkBlobType(url)
  console.log(file.value)

  return url
}

onMounted(async () => {
  try {
    loading.value = true
    if ((props.todo.attached_files as any[]).length > 0) {
      if (localStorage.getItem(`${id}${props.todo.ptid}`) && filesDownloadedForFirstTime.value) {
        file.value = localStorage.getItem(`${id}${props.todo.ptid}`) as string
        await checkBlobType(file.value)
      } else {
        const res = await withTokenInstance.get(
          `${PROJECTS_URL}${id}/tasks/${props.todo.ptid}/files/${
            (props.todo.attached_files as any[])[(props.todo.attached_files as any[]).length - 1]
              .tfid
          }`
        )

        const attachedFile = res.data.attached_file

        const newAxiosInstance = axios.create()
        newAxiosInstance.interceptors.request = withTokenInstance.interceptors.request
        newAxiosInstance.interceptors.response = withTokenInstance.interceptors.response

        const res2 = await newAxiosInstance.get(attachedFile, {
          cancelToken: source.token,
          responseType: 'blob'
        })

        localStorage.setItem(`${id}${props.todo.ptid}`, await forceFileDownload(res2.data))
        forceFileDownload(res2.data)
        setFilesDownloaded(true)
      }
    } else {
      file.value = doThis
      console.log('no file')
    }
  } catch (error) {
    attachedIs.value = 'image'
    file.value = doThis
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  source.cancel()
})

const color = computed(() => {
  if (props.todo.importance === 'important') {
    return 'bg-red-500'
  } else if (props.todo.importance === 'moderately_important') {
    return 'bg-yellow-500'
  } else {
    return 'bg-green-500'
  }
})

function checkBlobType(blobUrl: string) {
  return new Promise((resolve, reject) => {
    fetch(blobUrl)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        const uintArray = new Uint8Array(arrayBuffer)
        const header = uintArray.subarray(0, 4)
        const type = header.reduce((acc, cur) => acc + cur.toString(16), '')
        console.log(type)

        if (type === '00000018' || type === '66747970' || type === '00020') {
          attachedIs.value = 'video'
          resolve('video')
        } else if (type === '0001c') {
          attachedIs.value = 'audio'
          resolve('audio')
        } else {
          attachedIs.value = 'image'
          resolve('image')
        }
      })
      .catch((error) => reject(error))
  })
}
</script>

<template>
  <div class="max-w-sm border border-gray-200 rounded-lg shadow dark:border-gray-700">
    <div class="w-96 h-96 relative rounded-md flex justify-center items-center dark:bg-gray-800">
      <img
        v-if="!loading && attachedIs === 'image'"
        class="absolute h-full object-cover rounded-md"
        :src="file"
        alt="Todo attached img"
      />
      <video v-if="!loading && attachedIs === 'video'" class="absolute h-full" controls>
        <source :src="file" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <AudioPlayer
        v-if="!loading && attachedIs === 'audio'"
        class="absolute h-full w-full flex justify-center items-center"
        :style="{ width: '100%' }"
        :option="{
          src: file,
          title: 'Audio',
          coverImage: doThis
        }"
      />
      <div v-if="loading">
        <FileLoader />
      </div>
    </div>
    <div :class="['p-5', color]">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {{ todo.title }}
      </h5>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-200">
        {{
          todo.description.length > 300
            ? todo.description.substring(0, 300) + '...'
            : todo.description
        }}
      </p>

      <RouterLink
        :to="{ name: 'Todo', params: { todoId: todo.ptid } }"
        href="#"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Let's check it out
        <svg
          aria-hidden="true"
          class="w-4 h-4 ml-2 -mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </RouterLink>
    </div>
  </div>
</template>
