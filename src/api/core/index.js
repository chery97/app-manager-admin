import axios from 'axios'

// Axios 인스턴스 생성
const authRequest = axios.create({
  baseURL: 'http://localhost:4000', // API 기본 URL 설정
  timeout: 5000, // 요청 타임아웃 (5초)
})

// 요청 인터셉터 설정
authRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // 토큰 가져오기
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
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('인증 오류! 로그인 필요.')
      // 여기서 로그아웃 처리 또는 리프레시 토큰 로직 추가 가능
    }
    return Promise.reject(error)
  },
)

export default authRequest
