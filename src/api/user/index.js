import authRequest from '/src/api/core/index'

const user = {
  findAll: (query) => {
    let queryString = ''
    if (typeof query !== 'undefined') {
      const queryArray = Object.entries(query)
      const queryLength = queryArray.length
      queryArray.forEach((query, index) => {
        queryString += query.join('=')
        if (index < queryLength - 1) queryString += '&'
      })
    }
    return authRequest({
      method: 'GET',
      url: `/users?${queryString}`,
    })
  },
  findOne: (sno) => {
    return authRequest({
      method: 'GET',
      url: `/users/${sno}`,
    })
  },
  updateUserInfo: async (data) => {
    const result = await authRequest({
      method: 'PATCH',
      url: `/user-info/${data.userNo}`,
      data,
    })
    return result
  },
  getSummary: async () => {
    return await authRequest({
      method: 'GET',
      url: '/app/users/summary',
    })
  },
}

export default user
