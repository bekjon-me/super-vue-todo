import { withTokenInstance } from '../api/axios'
import { toast } from 'vue3-toastify'
import { PROJECTS_URL } from '@/utils/urls'
import { useModal } from '@/stores/modal'
import type { Todo } from '@/models/todo'
import type { Ref } from 'vue'

export const updateTodo = (
  todo: Todo,
  actualTodo: Ref<Todo | undefined>,
  id: string | string[],
  todoId: string | string[]
) => {
  const { toggleModal } = useModal()

  withTokenInstance
    .patch(PROJECTS_URL + id + '/tasks/' + todoId + '/', todo)
    .then((res) => {
      console.log(res.data)

      actualTodo.value = { ...actualTodo.value, ...res.data }
      toast.success('The todo has been updated')
    })
    .catch((err) => {
      console.log(err)
      if (err.response?.data.name) {
        toast.error(err.response.data.name[0])
      }
    })
    .finally(() => {
      toggleModal()
    })
}
