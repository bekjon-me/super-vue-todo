import { withTokenInstance } from '../api/axios'
import { toast } from 'vue3-toastify'
import type { User } from '@/models/user'
import { USER_URL } from '@/utils/urls'
import { useAuth } from '@/stores/auth'
import { useModal } from '@/stores/modal'
import { useLoader } from '@/stores/loader'

export const updateUser = async (user: User) => {
  const { createUser } = useAuth()
  const { toggleModal } = useModal()
  const { setLoader } = useLoader()

  try {
    setLoader(true)
    const res = await withTokenInstance.patch(USER_URL, user)
    createUser(res.data)
    toast.success('The user has been updated')
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
