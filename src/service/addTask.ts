import { withTokenInstance } from '../api/axios'
import { PROJECTS_URL } from '../utils/urls'
import { useTodos } from './../stores/todos'
import { toast } from 'vue3-toastify'
import { storeToRefs } from 'pinia'
import type { Todo } from '@/models/todo'
import type { Ref } from 'vue'

export const addTask = (newTodo: Todo, id: string, file: Ref<string | Blob>) => {
  const { createTodo } = useTodos()
  const { todos } = storeToRefs(useTodos())
  console.log(file.value)

  if (todos.value.find((todo) => todo.title === newTodo.title)) {
    toast.error('The task with this name already exists')
    return
  }

  withTokenInstance
    .post(PROJECTS_URL + id + '/tasks/', newTodo)
    .then(async (res) => {
      console.log(res.data)
      let attached_file_id = null

      const formData = new FormData()
      formData.append('attached_file', file.value)

      try {
        const response = await withTokenInstance.post(
          PROJECTS_URL + id + '/tasks/' + res.data.ptid + '/files/',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        attached_file_id = response.data.tfid
        console.log(response.data)
      } catch (error) {
        console.error(error)
      }

      const task = {
        ...res.data,
        attached_files: [
          {
            tfid: attached_file_id
          }
        ]
      }

      createTodo(task)
      toast.success('The task has been created')
      file.value = ''
    })
    .catch((err) => {
      console.log(err)
      if (err.response?.data.name) {
        toast.error(err.response.data.name[0])
      }
      if (err.response?.data.beginning) {
        console.log(err.response.data.beginning[0])
      }
      if (err.response?.data.importance) {
        console.log(err.response.data.importance[0])
      }
    })
}
