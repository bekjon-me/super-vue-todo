import { nonTokenInstance } from '../api/axios'
import { AUTH_USER_URL, LOGIN_USER_URL } from '../utils/urls'
import { toast } from 'vue3-toastify'
import router from '@/router'
import { useAuth } from './../stores/auth'

type Payload = {
  username: string
  email: string
  password1: string
  password2: string
}

export const handleRegister = (values: Payload) => {
  const { createUser } = useAuth()

  nonTokenInstance
    .post(AUTH_USER_URL, values)
    .then(async (res) => {
      console.log(res.data)
      const tokens = {
        access: res.data.access_token,
        refresh: res.data.refresh_token
      }
      localStorage.setItem('tokens', JSON.stringify(tokens))
      createUser(res.data.user)
      toast.success('You have successfully registered')
      router.push('/')
    })

    .catch((err) => {
      console.log(err)
      if (err.response?.data.username) {
        toast.error(err.response.data.username[0])
      }
      if (err.response?.data.email) {
        toast.error(err.response.data.email[0])
      }
      if (err.response?.data.password1) {
        toast.error(err.response.data.password1[0])
      }
      if (err.response?.data.non_field_errors) {
        toast.error(err.response.data.non_field_errors[0])
      }
    })
}
