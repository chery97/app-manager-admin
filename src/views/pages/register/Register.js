import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
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
import login from 'src/api/login'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const Register = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false) // 모달 노출 상태값
  const [modalMsg, setModalMsg] = useState('') // 모달 메세지
  const [isSuccess, setIsSuccess] = useState(true) // 회원가입 성공 상태값

  const {
    register, // 입력 필드와 연결
    handleSubmit, // 폼 제출 핸들러
    watch, // 현재 입력값을 추적
    formState: { errors }, // 입력값 검증 에러 관리
  } = useForm()

  // [Jay] 로그인 로직
  const FnJoin = async (userData) => {
    const response = await login.join(userData)
    return response.data
  }
  const joinMutation = useMutation({
    mutationFn: FnJoin,
    onSuccess: (data) => {
      setModalMsg('회원가입이 완료되었습니다.')
      setIsSuccess(true)
      setShowModal(true)
    },
    onError: (error) => {
      setModalMsg(error?.response?.data?.message)
      setIsSuccess(false)
      setShowModal(true)
    },
  })
  const onSubmit = (data) => {
    joinMutation.mutate({ id: data.id, password: data.password })
  }
  // END

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
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
                  {/*<CInputGroup className="mb-3">*/}
                  {/*  <CInputGroupText>@</CInputGroupText>*/}
                  {/*  <CFormInput placeholder="Email" autoComplete="email" />*/}
                  {/*</CInputGroup>*/}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      {...register('password', { required: '비밀번호를 입력하세요.' })}
                    />
                  </CInputGroup>
                  {/*<CInputGroup className="mb-4">*/}
                  {/*  <CInputGroupText>*/}
                  {/*    <CIcon icon={cilLockLocked} />*/}
                  {/*  </CInputGroupText>*/}
                  {/*  <CFormInput*/}
                  {/*    type="password"*/}
                  {/*    placeholder="Repeat password"*/}
                  {/*    autoComplete="new-password"*/}
                  {/*  />*/}
                  {/*</CInputGroup>*/}
                  <div className="d-grid">
                    <CButton color="success" type="submit">
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
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
              if (isSuccess) {
                navigate('/login')
              }
            }}
          >
            {isSuccess ? '로그인 페이지로 이동' : '닫기'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Register
