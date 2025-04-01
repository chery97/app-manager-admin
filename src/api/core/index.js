import axios from 'axios'
import config from '@coreui/coreui/js/src/util/config'
import { useNavigate } from 'react-router-dom'
import LoginExpiredModal from 'src/components/common/modal/LoginExpiredModal'
import React from 'react'

// Axios 인스턴스 생성
const authRequest = axios.create({
  baseURL: 'http://localhost:4000', // API 기본 URL 설정
  timeout: 5000, // 요청 타임아웃 (5초)
})

const refreshAuthRequest = axios.create({
  baseURL: 'http://localhost:4000', // API 기본 URL 설정
  timeout: 5000, // 요청 타임아웃 (5초)
})

const isTokenExpired = (token) => {
  if (!token) return true
  const decoded = JSON.parse(atob(token.split('.')[1]))
  return decoded.exp * 1000 < Date.now()
}

// 요청 인터셉터 설정
authRequest.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem('GEEK_SSID')
    const refreshToken = localStorage.getItem('GEEK_SSRID')

    // 토큰만료 시 새 토큰 발급
    if (accessToken && isTokenExpired(accessToken)) {
      const { data: newAccessToken } = await refreshAuthRequest({
        method: 'POST',
        url: '/common/auth/refresh',
        withCredentials: true,
      })
      if (newAccessToken) {
        localStorage.setItem('GEEK_SSID', newAccessToken)
        accessToken = newAccessToken
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

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
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
      // 만료 토큰 갱신
      const { data: newAccessToken } = await refreshAuthRequest({
        method: 'POST',
        url: '/common/auth/refresh',
        withCredentials: true,
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
