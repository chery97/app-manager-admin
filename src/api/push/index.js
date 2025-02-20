import authRequest from 'src/api/core'

const push = {
  sendPush: (formData) => {
    console.log(formData)
    return authRequest({
      method: 'POST',
      url: '/push',
      data: formData,
    })
  },
}

export default push
