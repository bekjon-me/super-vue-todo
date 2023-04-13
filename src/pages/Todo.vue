<script lang="ts" setup>
import Header from '@/components/Header.vue'
import Modal from '@/components/Modal.vue'
import { withTokenInstance } from '@/api/axios'
import { Importance, Status, type Todo } from '@/models/todo'
import { PROJECTS_URL } from '@/utils/urls'
import { onMounted, ref, toRaw, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useFilesDownloaded } from '@/stores/filesDownloaded'
import { useModal } from '@/stores/modal'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import moment from 'moment'
import VueDatePicker from '@vuepic/vue-datepicker'
import { updateTodo } from '@/service/updateTodo'

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
const loading = ref(false)
const actualTodo = ref<Todo>()
const modal = useModal()
const { showModal } = storeToRefs(modal)
const { toggleModal } = modal

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

// Main async function

// try {
//     loading.value = true
//     if ((props.todo.attached_files as any[]).length > 0) {
//       if (localStorage.getItem(`${id}${props.todo.ptid}`) && filesDownloadedForFirstTime.value) {
//         file.value = localStorage.getItem(`${id}${props.todo.ptid}`) as string
//         await checkBlobType(file.value)
//       } else {
//         const res = await withTokenInstance.get(
//           `${PROJECTS_URL}${id}/tasks/${props.todo.ptid}/files/${
//             (props.todo.attached_files as any[])[(props.todo.attached_files as any[]).length - 1]
//               .tfid
//           }`
//         )

//         const attachedFile = res.data.attached_file

//         const newAxiosInstance = axios.create()
//         newAxiosInstance.interceptors.request = withTokenInstance.interceptors.request
//         newAxiosInstance.interceptors.response = withTokenInstance.interceptors.response

//         // lets get content length of the file
//         async function getFileMetadata() {
//           const response = await newAxiosInstance(attachedFile, {
//             method: 'HEAD',
//             headers: {
//               'Content-Type': 'application/json'
//             }
//           })

//           // Retrieve metadata from response headers
//           const fileSize = response.headers.get('Content-Length')
//           const contentType = response.headers.get('Content-Type')

//           console.log(fileSize, contentType)

//           // Do something with the metadata, e.g. display it in UI
//         }

//         getFileMetadata()

//         const res2 = await newAxiosInstance.get(attachedFile, {
//           cancelToken: source.token,
//           responseType: 'blob'
//         })

//         localStorage.setItem(`${id}${props.todo.ptid}`, await forceFileDownload(res2.data))
//         forceFileDownload(res2.data)
//         setFilesDownloaded(true)
//       }
//     } else {
//       file.value = doThis
//       console.log('no file')
//     }
//   } catch (error) {
//     attachedIs.value = 'image'
//     file.value = doThis
//   } finally {
//     loading.value = false
//   }

onMounted(async () => {
  await withTokenInstance
    .get(PROJECTS_URL + id + '/tasks/' + todoId + '/')
    .then((response) => {
      actualTodo.value = response.data
      console.log(actualTodo.value)
    })
    .catch((error) => {
      console.log(error)
    })

  try {
    loading.value = true
    if ((actualTodo.value?.attached_files as any[]).length > 0) {
      actualTodo.value?.attached_files?.forEach(async (file) => {
        await withTokenInstance
          .get(`${PROJECTS_URL}${id}/tasks/${todoId}/files/${file.tfid}/`)
          .then(async (response) => {
            const attachedFile = response.data.attached_file

            const newAxiosInstance = axios.create()
            newAxiosInstance.interceptors.request = withTokenInstance.interceptors.request
            newAxiosInstance.interceptors.response = withTokenInstance.interceptors.response

            const res2 = await newAxiosInstance.get(attachedFile, {
              cancelToken: source.token,
              responseType: 'blob'
            })
            console.log(res2.data)

            // localStorage.setItem(`${id}${todoId}`, await forceFileDownload(res2.data))
            forceFileDownload(res2.data)
            setFilesDownloaded(true)
          })
          .catch((error) => {
            console.log(error)
          })
      })
    } else {
      // file.value = doThis
      // console.log('no file')
    }
  } catch (error) {
    // attachedIs.value = 'image'
    // file.value = doThis
  } finally {
    loading.value = false
  }
})

watchEffect(() => {
  console.log(files.value)
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

const editTodo = () => {
  modalTodo.value = { ...actualTodo.value }
  toggleModal()
  console.log('edit')
}

const handleSubmit = () => {
  updateTodo(toRaw(modalTodo.value), actualTodo, id, todoId)
}

const customPosition = () => ({ top: '100%', left: 0 })
</script>

<template>
  <Header />
  <div class="bg-gray-100 p-8 rounded-md shadow-md dark:bg-gray-800 dark:text-gray-200 relative">
    <h1 class="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
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
              {{
                key === 'beginning' || key === 'completion'
                  ? moment(actualTodo?.[key]).format('DD-MM-YYYY HH:mm:ss')
                  : actualTodo?.[key].split('_').join(' ').toUpperCase()
              }}
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="absolute bottom-2 right-6 flex flex-col items-center justify-center">
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
    <div class="absolute bottom-2 left-6">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="editTodo"
      >
        Edit
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
  </div>

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
