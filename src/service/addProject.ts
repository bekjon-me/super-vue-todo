import { withTokenInstance } from '../api/axios'
import { PROJECTS_URL } from '../utils/urls'
import { useProjects } from './../stores/projects'
import { toast } from 'vue3-toastify'

export const addProject = (name: string) => {
  const { createProject } = useProjects()
  withTokenInstance
    .post(PROJECTS_URL, { name })
    .then((res) => {
      console.log(res.data)

      createProject(res.data)
      toast.success('The project has been created')
    })
    .catch((err) => {
      console.log(err)
      if (err.response?.data.name) {
        toast.error(err.response.data.name[0])
      }
    })
}
