import authRequest from 'src/api/core'

const intro = {
  create: (params) => {
    return authRequest({
      method: 'POST',
      url: '/app/design',
      data: params,
    })
  },
  update: (params) => {
    return authRequest({
      method: 'PATCH',
      url: '/app/design',
      data: params,
    })
  },
  getIntro: () => {
    return authRequest({
      method: 'GET',
      url: '/app/design',
    })
  },
  findAll: () => {
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
      url: `/app?${queryString}`,
    })
  },
}

export default intro
