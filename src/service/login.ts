import { nonTokenInstance } from '../api/axios'
import { LOGIN_USER_URL } from '../utils/urls'
import { useAuth } from '@/stores/auth'
import { toast } from 'vue3-toastify'
import router from '@/router'

export const handleLogin = (values: any) => {
  const { createUser } = useAuth()
  nonTokenInstance
    .post(LOGIN_USER_URL, values)
    .then((res) => {
      console.log(res.data)
      const tokens = {
        access: res.data.access_token,
        refresh: res.data.refresh_token
      }

      localStorage.setItem('tokens', JSON.stringify(tokens))
      createUser(res.data.user)
      router.push('/')
      toast.success('You have successfully logged in')
    })
    .catch((err) => {
      console.log(err)
      console.log(err)
      if (err.response?.data.email) {
        toast.error(err.response.data.email[0])
      }
      if (err.response?.data.password) {
        toast.error(err.response.data.password[0])
      }
      if (err.response?.data.non_field_errors) {
        toast.error(err.response.data.non_field_errors[0])
      }
    })
}
