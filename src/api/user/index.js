import authRequest from '/src/api/core/index'

const user = {
  findAll: () => {
    return authRequest({
      method: 'GET',
      url: '/users',
    })
  },
}

export default user
