import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useMutation } from '@tanstack/react-query'
import login from 'src/api/login'
import { useForm } from 'react-hook-form'

const Login = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false) // 모달 노출 상태값
  const [modalMsg, setModalMsg] = useState('') // 모달 메세지

  const {
    register, // 입력 필드와 연결
    handleSubmit, // 폼 제출 핸들러
    watch, // 현재 입력값을 추적
    formState: { errors }, // 입력값 검증 에러 관리
  } = useForm()

  const FnLogin = async (userData) => {
    const response = await login.signIn(userData)
    return response.data
  }

  useEffect(() => {
    const verifyAccessToken = async () => {
      const accessToken = localStorage.getItem('GEEK_SSID')
      if (!accessToken) return
      try {
        const { data: isAccessToken } = await login.verifyAccessToken()
        if (isAccessToken) navigate('/dashboard')
      } catch (error) {
        console.log(error)
        const result = await login.signOut()
        if (result) {
          localStorage.removeItem('GEEK_SSID')
        }
      }
    }
    verifyAccessToken()
  }, [])

  const loginMutation = useMutation({
    mutationFn: FnLogin,
    onSuccess: (data) => {
      // [Jay] 엑세스 토큰값 로컬스토리지 저장
      localStorage.setItem('GEEK_SSID', data)
      navigate('/dashboard') // 로그인 성공 시 대시보드로 이동
    },
    onError: (error) => {
      setModalMsg(error?.response?.data?.message)
      setShowModal(true)
    },
  })
  const handleLogin = (data) => {
    loginMutation.mutate({ id: data.id, password: data.password })
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit(handleLogin)}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        {...register('id', { required: '아이디를 입력하세요.' })}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        {...register('password', { required: '비밀번호를 입력하세요.' })}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>

      <CModal visible={showModal}>
        <CModalHeader>
          <CModalTitle></CModalTitle>
        </CModalHeader>
        <CModalBody>{modalMsg}</CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setShowModal(false)
            }}
          >
            닫기
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Login
