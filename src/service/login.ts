import { nonTokenInstance } from '../api/axios'
import { LOGIN_USER_URL } from '../utils/urls'

export const handleLogin = (values: any) => {
  nonTokenInstance
    .post(LOGIN_USER_URL, values)
    .then((res) => {
      const parsedResponse = JSON.parse(res.data)
      const tokens = {
        access_token: parsedResponse.Token,
        refresh_token: parsedResponse.RefreshToken
      }

      const user = {
        email: parsedResponse.Email,
        fullName: parsedResponse.FullName
      }

      localStorage.setItem('tokens', JSON.stringify(tokens))
      localStorage.setItem('id', parsedResponse.UserId)
    })
    .catch((err) => {})
}
