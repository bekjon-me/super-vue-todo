import { withTokenInstance } from '../api/axios'
import { toast } from 'vue3-toastify'
import { PROJECTS_URL } from '@/utils/urls'
import { useModal } from '@/stores/modal'
import type { Ref } from 'vue'
import type { Project } from '@/models/project'
import { useProjects } from '@/stores/projects'

export const deleteProject = (id: number) => {
  const { toggleModal } = useModal()
  const { projects, updateProject, deleteProject } = useProjects()

  withTokenInstance
    .delete(PROJECTS_URL + id + '/')
    .then((res) => {
      deleteProject(id)
      toast.success('The project has been updated')
    })
    .catch((err) => {
      console.log(err)
      if (err.response?.data.name) {
        toast.error(err.response.data.name[0])
      }
    })
}
