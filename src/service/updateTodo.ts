import { withTokenInstance } from '../api/axios'
import { toast } from 'vue3-toastify'
import { PROJECTS_URL } from '@/utils/urls'
import { useModal } from '@/stores/modal'
import { useLoader } from '@/stores/loader'
import type { Todo } from '@/models/todo'
import type { Ref } from 'vue'

export const updateTodo = async (
  todo: Todo,
  actualTodo: Ref<Todo | undefined>,
  id: string | string[],
  todoId: string | string[]
) => {
  const { toggleModal } = useModal()
  const { setLoader } = useLoader()

  try {
    setLoader(true)
    const res = await withTokenInstance.patch(PROJECTS_URL + id + '/tasks/' + todoId + '/', todo)
    actualTodo.value = { ...actualTodo.value, ...res.data }
    toast.success('The todo has been updated')
  } catch (err: any) {
    console.log(err)
    if (err.response?.data.name) {
      toast.error(err.response.data.name[0])
    }
  } finally {
    toggleModal()
    setLoader(false)
  }
}
