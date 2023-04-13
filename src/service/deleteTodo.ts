import { withTokenInstance } from '../api/axios'
import { toast } from 'vue3-toastify'
import { PROJECTS_URL } from '@/utils/urls'
import { useLoader } from '@/stores/loader'
import { useTodos } from '@/stores/todos'
import router from '@/router'

export const deleteTodo = async (id: string, todoId: string) => {
  const { deleteTodo } = useTodos()
  const { setLoader } = useLoader()

  try {
    setLoader(true)
    const res = await withTokenInstance.delete(PROJECTS_URL + id + '/' + 'tasks/' + todoId + '/')
    deleteTodo(id as unknown as number)
    toast.success('The todo has been deleted')
    router.push({ name: 'Project', params: { id } })
  } catch (err: any) {
    console.log(err)
    if (err.response?.data.name) {
      toast.error(err.response.data.name[0])
    }
  } finally {
    setLoader(false)
  }
}
