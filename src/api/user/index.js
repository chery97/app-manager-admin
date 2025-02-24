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
}

export default user
