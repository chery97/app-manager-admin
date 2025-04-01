import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
  useColorModes,
} from '@coreui/react'
import './scss/style.scss'

import LoginExpiredModal from 'src/components/common/modal/LoginExpiredModal'
// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'
import { DialogProvider } from 'src/context/Dialogcontext'
import login from 'src/api/login'
import authRequest from 'src/api/core'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="*" name="Home" element={<ProtectedRoute />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

// [Jay] 로그인 체크 컴포넌트
const ProtectedRoute = () => {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const onCloseModal = () => {
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    const checkAccessToken = async () => {
      const accessToken = localStorage.getItem('GEEK_SSID')
      if (!accessToken) {
        setShowModal(true) // 토큰이 없으면 모달 표시
        return
      }

      const decoded = JSON.parse(atob(accessToken.split('.')[1]))
      let expiresIn = decoded.exp * 1000 - Date.now()

      // 토큰 만료 3분 전 미리 갱신 처리
      if (expiresIn < 3 * 60 * 1000) {
        try {
          const { data: newAccessToken } = await authRequest({
            method: 'POST',
            url: '/common/auth/refresh',
          })
          if (newAccessToken) {
            localStorage.setItem('GEEK_SSID', newAccessToken)

            // setTimeout과 중복 실행 방지
            const newDecoded = JSON.parse(atob(newAccessToken.split('.')[1]))
            expiresIn = newDecoded.exp * 1000 - Date.now()
          } else {
            console.error('유효하지 않은 RefreshToken', error)
            setShowModal(true)
          }
        } catch (error) {
          console.error('토큰 검증 실패', error)
          setShowModal(true)
        }
      }
      setTimeout(checkAccessToken, expiresIn - 3 * 60 * 1000)
    }
    checkAccessToken()
  }, [])

  return (
    <>
      <DialogProvider>
        <DefaultLayout />
      </DialogProvider>

      {/*토큰값이 없는 경우 모달 알럿 노출*/}
      {showModal && <LoginExpiredModal isVisible={showModal} onClose={onCloseModal} />}
    </>
  )
}

export default App
