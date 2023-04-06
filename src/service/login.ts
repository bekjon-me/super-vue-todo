import { useProjects } from './../stores/projects'
import { useLoader } from './../stores/loader'
import { nonTokenInstance, withTokenInstance } from '../api/axios'
import { LOGIN_USER_URL, PROJECTS_URL } from '../utils/urls'
import { useAuth } from '@/stores/auth'
import { toast } from 'vue3-toastify'
import router from '@/router'

export const handleLogin = async (values: any) => {
  const { createUser } = useAuth()
  const { setLoader } = useLoader()
  const { setProjects } = useProjects()

  try {
    setLoader(true)
    const res = await nonTokenInstance.post(LOGIN_USER_URL, values)
    console.log(res.data)
    const tokens = {
      access: res.data.access_token,
      refresh: res.data.refresh_token
    }
    localStorage.setItem('tokens', JSON.stringify(tokens))
    createUser(res.data.user)
    router.push('/')
    toast.success('You have successfully logged in')
  } catch (error: any) {
    console.log(error)
    if (error.response?.data.email) {
      toast.error(error.response.data.email[0])
    }
    if (error.response?.data.password) {
      toast.error(error.response.data.password[0])
    }
    if (error.response?.data.non_field_errors) {
      toast.error(error.response.data.non_field_errors[0])
    }
  } finally {
    setLoader(false)
  }

  try {
    setLoader(true)
    const res = await withTokenInstance.get(PROJECTS_URL)
    setProjects(res.data)
  } catch (error: any) {
    console.log(error)
  } finally {
    setLoader(false)
  }
}
