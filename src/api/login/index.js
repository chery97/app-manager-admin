import authRequest from '/src/api/core/index'

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
  getRefreshToken: (data) => {
    authRequest({
      method: 'POST',
      url: '/auth/refresh',
      data,
    })
  },
}

export default login
