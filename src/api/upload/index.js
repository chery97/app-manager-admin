import authRequest from 'src/api/core'

const upload = {
  uploadFile: (formData) => {
    return authRequest({
      method: 'POST',
      url: '/common/upload',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf-8',
      },
    })
  },
}

export default upload
