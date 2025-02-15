import authRequest from '/src/api/core/index'

const login = {
  join: (data) => {
    return authRequest({
      method: 'POST',
      url: '/manager/join',
      data,
    })
  },
  signIn: (data) => {
    return authRequest({
      method: 'POST',
      url: '/manager/login',
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
