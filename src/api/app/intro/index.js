import authRequest from 'src/api/core/index'

const intro = {
  create: (params) => {
    return authRequest({
      method: 'POST',
      url: '/design',
      data: params,
    })
  },
}

export default intro
