<script setup lang="ts">
import Header from '@/components/Header.vue'
import Button from '@/components/Button.vue'
import Modal from '@/components/Modal.vue'
import TodoCard from '@/components/TodoCard.vue'
import { withTokenInstance } from '@/api/axios'
import { PROJECTS_URL } from '@/utils/urls'
import { onMounted, ref, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { useModal } from '@/stores/modal'
import { useTodos } from '@/stores/todos'
import { useLoader } from '@/stores/loader'
import { storeToRefs } from 'pinia'
import { Status, type Todo } from '@/models/todo'
import { Importance } from '@/models/todo'
import { addTask } from '@/service/addTask'
import Datepicker from 'vue3-datepicker'

const fetchData = async () => {
  try {
    setLoader(true)
    const res = await withTokenInstance.get(`${PROJECTS_URL}${id}/tasks`)
    setTodos(res.data)
  } catch (error) {
    console.log(error)
  } finally {
    setLoader(false)
  }
}

onMounted(async () => {
  fetchData()
})

const { setLoader } = useLoader()
const modal = useModal()
const todosStore = useTodos()
const { setTodos } = todosStore
const { todos } = storeToRefs(todosStore)
const { toggleModal } = modal
const { showModal } = storeToRefs(modal)
const { params } = useRoute()
const { id } = params

const newTodo = ref({
  title: '',
  description: '',
  beginning: new Date(),
  completion: new Date(),
  importance: '',
  current_status: ''
})

const file = ref<string | Blob>('')

const handleAddTask = () => {
  console.log(toRaw(newTodo.value))

  toggleModal()
  addTask(toRaw(newTodo.value), id as string, file)
}

const handleFileUpload = (e: any) => {
  file.value = e.target.files[0]
  console.log(file.value)
}

const format = 'yyyy-MM-dd HH:mm:ss'
</script>

<template>
  <Header />
  <Button @click="toggleModal"> Add task </Button>
  <Modal v-if="showModal">
    <template #form>
      <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add a new task</h3>
      <form class="space-y-3" @submit.prevent="handleAddTask">
        <label
          for="projectName"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Name of the task</label
        >
        <input
          type="text"
          name="projectName"
          id="projectName"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="Add a name"
          required
          v-model.trim="newTodo.title"
        />
        <label
          for="description"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Description of the task</label
        >
        <input
          type="text"
          name="description"
          id="description"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="Description"
          required
          v-model.trim="newTodo.description"
        />
        <div class="flex flex-col gap-x-4 justify-around mt-2">
          <div>
            <label
              class="block mt-4 text-sm font-medium text-gray-900 dark:text-white"
              for="startDate"
            >
              Start date
            </label>
            <Datepicker
              id="startDate"
              type="date"
              class="border-[1px] border-[#333] rounded py-[12px] px-[24px] mt-[12px] mb-[12px] text-[#333] w-full"
              v-model="newTodo.beginning"
              :format="format"
            />
          </div>
          <div>
            <label
              class="block mt-4 text-sm font-medium text-gray-900 dark:text-white"
              for="endDate"
            >
              End date
            </label>
            <Datepicker
              id="endDate"
              type="date"
              class="border-[1px] border-[#333] rounded py-[12px] px-[24px] mt-[12px] mb-[12px] text-[#333] w-full"
              v-model="newTodo.completion"
              :format="format"
            />
          </div>
        </div>
        <label
          for="importance"
          class="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Level of importance</label
        >
        <select
          required
          id="importance"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          v-model="newTodo.importance"
        >
          <option value="">Choose a level</option>
          <option :value="Importance.notImportant">Not important</option>
          <option :value="Importance.moderately">Moderately important</option>
          <option :value="Importance.important">Important</option>
        </select>

        <label
          for="status"
          class="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Current status</label
        >
        <select
          required
          id="status"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          v-model="newTodo.current_status"
        >
          <option value="">Choose a status</option>
          <option :value="Status.queue">Queue</option>
          <option :value="Status.development">Development</option>
          <option :value="Status.done">Done</option>
        </select>

        <label
          class="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
          for="file_input"
          >You can upload a file</label
        >
        <input
          class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          aria-describedby="file_input_help"
          id="file_input"
          type="file"
          @change="handleFileUpload"
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

  <div class="mt-2 text-[30px] text-[#333] border-b-2 dark:text-white">Tasks</div>
  <div class="flex flex-wrap gap-4 justify-around mt-2">
    <TodoCard v-for="todo in todos" :todo="todo" />
  </div>
</template>
