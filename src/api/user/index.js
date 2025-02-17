import authRequest from '/src/api/core/index'

const user = {
  findAll: (query) => {
    return authRequest({
      method: 'GET',
      url: `/users?pageSize${query.pageSize}&page=${query.page}`,
    })
  },
}

export default user
