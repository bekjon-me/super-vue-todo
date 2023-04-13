import { withTokenInstance } from '../api/axios'
import { toast } from 'vue3-toastify'
import { PROJECTS_URL } from '@/utils/urls'
import { useModal } from '@/stores/modal'
import { useProjects } from '@/stores/projects'
import { useLoader } from '@/stores/loader'
import type { Ref } from 'vue'
import type { Project } from '@/models/project'

export const updateProject = async (project: Ref<Project>) => {
  const { toggleModal } = useModal()
  const { projects, updateProject } = useProjects()
  const { setLoader } = useLoader()

  if (projects.find((p) => p.name === project.value.name)) {
    toast.error('The project name already exists')
    return
  }

  try {
    setLoader(true)
    const res = await withTokenInstance.patch(PROJECTS_URL + project.value.upid + '/', {
      name: project.value.name
    })

    updateProject(res.data)
    toast.success('The project has been updated')
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
