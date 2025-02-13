import authRequest from '/src/api/core/index'

const login = {
  signIn: (data) => {
    return authRequest({
      method: 'POST',
      url: '/auth/login',
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
