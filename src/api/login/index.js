import authRequest, { refreshAuthRequest } from '/src/api/core/index'

const login = {
  join: (data) => {
    return authRequest({
      method: 'POST',
      url: '/users/join',
      data,
    })
  },
  signIn: (data) => {
    return authRequest({
      method: 'POST',
      url: '/users/login',
      withCredentials: true,
      data,
    })
  },
  signOut: () => {
    return authRequest({
      method: 'POST',
      url: '/app/users/logout',
      withCredentials: true,
    })
  },
  renewAccessToken: () => {
    return refreshAuthRequest({
      method: 'POST',
      url: '/common/auth/refresh',
      withCredentials: true,
    })
  },
  verifyAccessToken: () => {
    return authRequest({
      method: 'POST',
      url: '/common/auth/token-check',
    })
  },
}

export default login
