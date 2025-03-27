import authRequest from 'src/api/core/index'

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
      method: 'PUT',
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
}

export default intro
