<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { PROJECTS_URL } from '@/utils/urls'
import { withTokenInstance } from '@/api/axios'
import doThis from '@/assets/dothis.jpg'
import FileLoader from '@/components/FileLoader.vue'
import type { Todo } from '@/models/todo'

const props = defineProps<{
  todo: Todo
}>()

onMounted(async () => {
  try {
    loading.value = true
    if ((props.todo.attached_files as any[]).length > 0) {
      const res = await withTokenInstance.get(
        `${PROJECTS_URL}${id}/tasks/${props.todo.ptid}/files/${
          (props.todo.attached_files as any[])[(props.todo.attached_files as any[]).length - 1].tfid
        }`
      )
      const res2 = await withTokenInstance.get(res.data.attached_file, {
        responseType: 'blob'
      })
      forceFileDownload(res2.data)
    } else {
      file.value = doThis
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
})

const { params } = useRoute()
const { id } = params

const loading = ref(false)
const file = ref('')
const commonClass = ref(
  'max-w-sm  border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'
)
const importance = ['not_important', 'moderately_important', 'important']
console.log()

const activeClass = ref(['bg-white', 'bg-[#fffb009a]', 'bg-[#ff000083]'])

const forceFileDownload = (response: any) => {
  const url = window.URL.createObjectURL(new Blob([response]))
  file.value = url
}
</script>

<template>
  <div :class="[commonClass, activeClass[importance.indexOf(props.todo.importance)]]">
    <div class="w-96 h-96 relative rounded-md flex justify-center items-center bg-black">
      <img
        v-if="!loading"
        class="absolute h-full object-cover rounded-md"
        :src="file"
        alt="Todo attached img"
      />
      <div v-else>
        <FileLoader />
      </div>
    </div>
    <div class="p-5">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {{ todo.title }}
      </h5>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
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
