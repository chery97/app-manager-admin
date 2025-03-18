import axios from 'axios'
import config from '@coreui/coreui/js/src/util/config'
import { useNavigate } from 'react-router-dom'
import LoginExpiredModal from 'src/components/common/modal/LoginExpiredModal'
import React from 'react'
import { isClass } from 'eslint-plugin-react/lib/util/ast'

// Axios 인스턴스 생성
const authRequest = axios.create({
  baseURL: 'http://localhost:4000', // API 기본 URL 설정
  timeout: 5000, // 요청 타임아웃 (5초)
})

// 요청 인터셉터 설정
authRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('GEEK_SSID') // 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 응답 인터셉터 설정 (선택 사항: 예외 처리, 리프레시 토큰 등)
authRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const { data: newAccessToken } = await authRequest({
        method: 'POST',
        url: '/common/auth/refresh',
        data: { refreshToken: `${localStorage.getItem('GEEK_SSRID')}` },
      })
      if (newAccessToken) {
        localStorage.setItem('GEEK_SSID', newAccessToken)
      } else {
        const navigate = useNavigate()
        return (
          <LoginExpiredModal
            isVisible={true}
            onClose={() => {
              navigate('/login', { replace: true })
            }}
          ></LoginExpiredModal>
        )
      }
    }
    return Promise.reject(error)
  },
)

export default authRequest
