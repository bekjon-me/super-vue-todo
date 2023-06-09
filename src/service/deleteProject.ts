import { withTokenInstance } from '../api/axios'
import { toast } from 'vue3-toastify'
import { PROJECTS_URL } from '@/utils/urls'
import { useProjects } from '@/stores/projects'
import { useLoader } from '@/stores/loader'

export const deleteProject = async (id: number) => {
  const { deleteProject } = useProjects()
  const { setLoader } = useLoader()

  try {
    setLoader(true)
    const res = await withTokenInstance.delete(PROJECTS_URL + id + '/')
    deleteProject(id)
    toast.success('The project has been deleted')
  } catch (err: any) {
    console.log(err)
    if (err.response?.data.name) {
      toast.error(err.response.data.name[0])
    }
  } finally {
    setLoader(false)
  }
}
