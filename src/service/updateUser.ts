import { withTokenInstance } from '../api/axios'
import { toast } from 'vue3-toastify'
import type { User } from '@/models/user'
import { useAuth } from '@/stores/auth'
import { USER_URL } from '@/utils/urls'
import { useModal } from '@/stores/modal'

export const updateUser = (user: User) => {
  const { createUser } = useAuth()
  const { toggleModal } = useModal()

  withTokenInstance
    .patch(USER_URL, user)
    .then((res) => {
      console.log(res.data)

      createUser(res.data)
      toast.success('The user has been updated')
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
