import { withTokenInstance } from '../api/axios'
import { toast } from 'vue3-toastify'
import { PROJECTS_URL } from '@/utils/urls'
import { useModal } from '@/stores/modal'
import type { Ref } from 'vue'
import type { Project } from '@/models/project'
import { useProjects } from '@/stores/projects'

export const updateProject = (project: Ref<Project>) => {
  const { toggleModal } = useModal()
  const { projects, updateProject } = useProjects()

  if (projects.find((p) => p.name === project.value.name)) {
    toast.error('The project name already exists')
    return
  }

  withTokenInstance
    .patch(PROJECTS_URL + project.value.upid + '/', { name: project.value.name })
    .then((res) => {
      console.log(res.data)
      updateProject(res.data)
      toast.success('The project has been updated')
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
