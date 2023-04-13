import { withTokenInstance } from '../api/axios'
import { PROJECTS_URL } from '../utils/urls'
import { useProjects } from './../stores/projects'
import { useLoader } from '@/stores/loader'
import { toast } from 'vue3-toastify'
import { storeToRefs } from 'pinia'

export const addProject = async (name: string) => {
  const { createProject } = useProjects()
  const { projects } = storeToRefs(useProjects())
  const { setLoader } = useLoader()

  if (projects.value.find((project) => project.name === name)) {
    toast.error('The project with this name already exists')
    return
  }

  try {
    setLoader(true)
    const response = await withTokenInstance.post(PROJECTS_URL, { name })
    createProject(response.data)
    toast.success('The project has been created')
  } catch (error: any) {
    console.log(error)
    if (error.response?.data.name) {
      toast.error(error.response.data.name[0])
    }
  } finally {
    setLoader(false)
  }
}
