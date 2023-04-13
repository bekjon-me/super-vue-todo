<script lang="ts" setup>
import Header from '@/components/Header.vue'
import Modal from '@/components/Modal.vue'
import Confirmation from '@/components/Confirmation.vue'
import { withTokenInstance } from '@/api/axios'
import { Importance, Status, type Todo } from '@/models/todo'
import { PROJECTS_URL } from '@/utils/urls'
import { onMounted, ref, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { useFilesDownloaded } from '@/stores/filesDownloaded'
import { useModal } from '@/stores/modal'
import { useLoader } from '@/stores/loader'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import moment from 'moment'
import VueDatePicker from '@vuepic/vue-datepicker'
import { updateTodo } from '@/service/updateTodo'
import { deleteTodo } from '@/service/deleteTodo'
import router from '@/router'

type File = {
  value: string
  type: string
}

const source = axios.CancelToken.source()
const { params } = useRoute()
const { id, todoId } = params
const { setFilesDownloaded } = useFilesDownloaded()
const { filesDownloadedForFirstTime } = storeToRefs(useFilesDownloaded())
const files = ref<File[]>([])
const { setLoader } = useLoader()
const modal = useModal()
const { showModal } = storeToRefs(modal)
const actualTodo = ref<Todo>()
const { toggleModal } = modal
const confirmationModal = ref(false)

function checkBlobType(blobUrl: string) {
  console.log(blobUrl)

  return new Promise((resolve, reject) => {
    fetch(blobUrl)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        const uintArray = new Uint8Array(arrayBuffer)
        const header = uintArray.subarray(0, 4)
        const type = header.reduce((acc, cur) => acc + cur.toString(16), '')

        console.log(type)

        if (type === '00000018' || type === '66747970' || type === '00020') {
          files.value?.push({
            value: blobUrl,
            type: 'video'
          })
          console.log(files.value)

          resolve('video')
        } else if (type === '0001c') {
          files.value?.push({
            value: blobUrl,
            type: 'audio'
          })
          resolve('audio')
        } else {
          files.value?.push({
            value: blobUrl,
            type: 'image'
          })
          resolve('image')
        }
      })
      .catch((error) => reject(error))
  })
}

const forceFileDownload = async (response: any) => {
  const url = window.URL.createObjectURL(response)
  checkBlobType(url)

  return url
}

onMounted(async () => {
  try {
    setLoader(true)
    const response = await withTokenInstance.get(PROJECTS_URL + id + '/tasks/' + todoId + '/')
    actualTodo.value = response.data
    console.log(actualTodo.value)
  } catch (error: any) {
    if (error.response.status === 404) {
      await router.push({ name: 'Project', params: { id } })
    }
    console.log(error)
  } finally {
    setLoader(false)
  }
})

const shownKeys = {
  beginning: 'Beginning',
  completion: 'Due Date',
  importance: 'Importance',
  current_status: 'Status'
}

const modalTodo = ref()

const labels = {
  title: 'Title',
  description: 'Description',
  beginning: 'Beginning',
  completion: 'Due Date',
  importance: 'Importance',
  current_status: 'Status'
}

const importanceColors = {
  not_important: 'bg-green-500 p-2 rounded',
  moderately_important: 'bg-yellow-500 p-2 rounded',
  important: 'bg-red-500 p-2 rounded'
}

const handleEdit = () => {
  modalTodo.value = { ...actualTodo.value }
  toggleModal()
  console.log('edit')
}

const handleDelete = () => {
  console.log('delete')
  deleteTodo(id as string, todoId as string)
}

const handleSubmit = () => {
  updateTodo(toRaw(modalTodo.value), actualTodo, id, todoId)
}

const closeConfirmation = () => {
  confirmationModal.value = false
}

const customPosition = () => ({ top: '100%', left: 0 })
</script>

<template>
  <Header />
  <div class="bg-gray-100 p-8 rounded-md shadow-md dark:bg-gray-800 dark:text-gray-200 relative">
    <h1 class="mb-3 mt-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
      {{ actualTodo?.title }}
    </h1>
    <p class="mb-3 text-gray-500 dark:text-gray-400">{{ actualTodo?.description }}</p>

    <div class="flow-root mb-4">
      <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="(value, key) in shownKeys" class="py-3 sm:py-4">
          <div class="flex items-center space-x-4">
            <div class="flex-1 min-w-0">
              <p class="text-md font-medium text-gray-900 truncate dark:text-white">
                {{ value }}
              </p>
            </div>
            <div
              class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
            >
              <h2 v-if="key === 'beginning' || key === 'completion'">
                {{ moment(actualTodo?.[key]).format('DD-MM-YYYY HH:mm:ss') }}
              </h2>
              <div
                v-else-if="key === 'importance'"
                :class="importanceColors[actualTodo?.importance as 'not_important' | 'moderately_important' | 'important']"
              >
                {{ actualTodo?.[key].split('_').join(' ').toUpperCase() }}
              </div>
              <h2 v-else>{{ actualTodo?.[key].split('_').join(' ').toUpperCase() }}</h2>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="absolute top-2 right-2 flex flex-col items-center justify-center">
      <span class="text-xs text-gray-500 dark:text-gray-400">
        Created at
        {{ moment(actualTodo?.created).format('DD-MM-YYYY HH:mm:ss') }}
      </span>

      <span class="text-xs text-gray-500 dark:text-gray-400">
        Last updated at
        {{ moment(actualTodo?.updated).format('DD-MM-YYYY HH:mm:ss') }}
      </span>
    </div>
    <!-- // edit button is here -->
    <div class="absolute bottom-2 left-6 flex gap-4">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="handleEdit"
      >
        Edit
      </button>
      <button
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        @click="handleDelete"
      >
        Delete
      </button>
    </div>

    <Modal v-if="showModal">
      <template #form>
        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
          <div v-for="(value, key) in labels">
            <div class="flex flex-col gap-2">
              <label :for="key">{{ value }}</label>
              <VueDatePicker
                v-if="key === 'beginning' || key === 'completion'"
                id="startDate"
                type="date"
                class="border-none rounded mt-[12px] mb-[12px] text-[#333] w-full"
                v-model="(modalTodo as Todo)[key]"
                :alt-position="customPosition"
              />

              <select
                v-else-if="key === 'importance'"
                required
                id="importance"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                v-model="modalTodo.importance"
              >
                <option value="">Choose a level</option>
                <option :value="Importance.notImportant">Not important</option>
                <option :value="Importance.moderately">Moderately important</option>
                <option :value="Importance.important">Important</option>
              </select>

              <select
                v-else-if="key === 'current_status'"
                required
                id="status"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                v-model="modalTodo.current_status"
              >
                <option value="">Choose a status</option>
                <option :value="Status.queue">Queue</option>
                <option :value="Status.development">Development</option>
                <option :value="Status.done">Done</option>
              </select>

              <input
                v-else
                type="text"
                :id="key"
                class="border border-gray-300 rounded-md p-2 dark:text-gray-800"
                v-model="(modalTodo as Todo)[key]"
              />
            </div>
          </div>

          <div class="flex justify-end">
            <button type="submit" class="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md">
              Save
            </button>
          </div>
        </form>
      </template>
    </Modal>
    <!-- <Confirmation v-if="confirmationModal" @closeFn="closeConfirmation" @doFn="handleDelete" /> -->
  </div>

  <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4 mt-8 md:mt-12 md:mb-6">
    Attached files
  </h2>

  <!-- <div
    v-if="files.length > 0"
    class="flex flex-col items-center justify-center w-full h-full md:mx-20 md:text-lg"
  >
    <div
      class="w-96 h-96 relative rounded-md flex justify-center items-center dark:bg-gray-800"
      v-for="file in files"
    >
      <img
        v-if="!loading && file.type === 'image'"
        class="absolute h-full object-cover rounded-md"
        :src="file.value"
        alt="Todo attached img"
      />
      <video v-if="!loading && file.type === 'video'" class="absolute h-full" controls>
        <source :src="file.value" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <AudioPlayer
        v-if="!loading && file.type === 'audio'"
        class="absolute h-full w-full flex justify-center items-center"
        :style="{ width: '100%' }"
        :option="{
          src: file.value,
          title: 'Audio',
          coverImage: doThis
        }"
      />
      <div v-if="loading">
        <FileLoader />
      </div>
    </div>
  </div> -->
</template>
