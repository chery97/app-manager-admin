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
  getIntro: (appId) => {
    return authRequest({
      method: 'GET',
      url: `/app/design/intro/${appId}`,
    })
  },
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
      url: `/app/app-manager?${queryString}`,
    })
  },
  findOne: async (sno) => {
    try {
      const response = await authRequest({
        method: 'GET',
        url: `/app/app-manager/${sno}`,
      })
      return response
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const status = error.response.status
        return { data: { status } }
      }
      throw error
    }
  },
  registerAppInfo: (params) => {
    return authRequest({
      method: 'POST',
      url: '/app/app-manager',
      data: params,
    })
  },
  updateAppInfo: (params) => {
    return authRequest({
      method: 'PATCH',
      url: '/app/app-manager',
      data: params,
    })
  },
}

export default intro
