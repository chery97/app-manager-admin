import authRequest from 'src/api/core/index'

const footer = {
  update: (params) => {
    return authRequest({
      method: 'PATCH',
      url: `/app/design/footer/${params.appId}`,
      data: { tabData: params.tabData },
    })
  },
  getFooter: ({ appId }) => {
    return authRequest({
      method: 'GET',
      url: `/app/design/footer/${appId}`,
    })
  },
}

export default footer
