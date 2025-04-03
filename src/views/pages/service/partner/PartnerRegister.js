import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { NavLink, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
} from '@coreui/react'
import user from 'src/api/user'
import login from 'src/api/login'
import AppManagement from 'src/views/pages/service/app/AppManagement'

const PartnerRegister = () => {
  const { sno } = useParams()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const isEditable = !!sno
  const [activeTab, setActiveTab] = React.useState('detail')
  const [showModal, setShowModal] = useState(false)
  const [modalMsg, setModalMsg] = useState('')
  const [userType, setUserType] = useState('partner')
  const [isSuccess, setIsSuccess] = useState(true)

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const fetchData = async (sno) => {
    try {
      const { data } = await user.findOne(Number(sno))
      setUserType(data.userType)
      reset(data)
    } catch (error) {
      console.error('error:', error)
    }
  }

  useEffect(() => {
    if (sno) {
      fetchData(sno)
    }
  }, [sno])

  const onSubmitDetail = (data) => {
    if (isEditable) {
      partnerUpdateMutation.mutate({
        id: data.id,
        userNo: sno,
        name: data.name,
        tel: data.tel,
        userType: data.userType,
        email: data.email,
      })
    } else {
      joinMutation.mutate({
        id: data.id,
        password: data.password,
        userName: data.name,
        userTel: data.tel,
        userType: data.userType,
        userEmail: data.email,
      })
    }
  }

  const partnerUpdateMutation = useMutation({
    mutationFn: async (data) => await user.updateUserInfo(data),
    onSuccess: (data) => {
      setModalMsg('수정이 완료되었습니다.')
      setIsSuccess(true)
      setShowModal(true)
    },
    onError: (error) => {
      setModalMsg(error?.response?.data?.message)
      setIsSuccess(false)
      setShowModal(true)
    },
  })

  const joinMutation = useMutation({
    mutationFn: async (data) => await login.join(data),
    onSuccess: (data) => {
      setModalMsg('등록이 완료되었습니다.')
      setIsSuccess(true)
      setShowModal(true)
    },
    onError: (error) => {
      setModalMsg(error?.response?.data?.message)
      setIsSuccess(false)
      setShowModal(true)
    },
  })

  const onSubmitApp = (data) => {
    console.log('앱 관리 탭 제출 데이터:', data)
  }

  return (
    <>
      <CTabs activeItemKey={activeTab} onTabChange={handleTabChange}>
        <CTabList variant="tabs">
          <CTab itemKey="detail">
            <strong>{isEditable ? '파트너 수정' : '파트너 등록'}</strong>
          </CTab>
          {userType === 'partner' && (
            <CTab itemKey="app">
              <strong>앱 관리</strong>
            </CTab>
          )}
        </CTabList>
        <CTabContent>
          <CTabPanel className="p-2" itemKey="detail">
            <CForm className="row g-3" onSubmit={handleSubmit(onSubmitDetail)}>
              <CCard className="p-0">
                <CCardBody>
                  <CCol className="bg-dark p-3" xs={12} md={6}>
                    <CRow className="mb-3">
                      <CCol xs={6}>
                        <CFormInput
                          type="text"
                          label="아이디"
                          {...register('id', { required: '아이디를 입력하세요' })}
                          readOnly={isEditable}
                        />
                        {errors.id && <p>{errors.id.message}</p>}
                      </CCol>
                      {!isEditable && (
                        <CCol xs={6}>
                          <CFormInput
                            type="password"
                            label="비밀번호"
                            {...register('password', { required: '비밀번호를 입력하세요' })}
                          />
                          {errors.password && <p>{errors.password.message}</p>}
                        </CCol>
                      )}
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          type="text"
                          label="이름"
                          {...register('name', { required: '이름을 입력하세요' })}
                        />
                        {errors.name && <p>{errors.name.message}</p>}
                      </CCol>
                      <CCol>
                        <CFormSelect label="타입" {...register('userType')}>
                          <option value="partner">파트너</option>
                          <option value="admin">관리자</option>
                        </CFormSelect>
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="연락처"
                          type="text"
                          {...register('tel', {
                            required: '연락처를 입력하세요',
                            pattern: { value: /^[0-9]+$/, message: '숫자만 입력하세요.' },
                          })}
                          placeholder="01012345678"
                        />
                        {errors.tel && <p>{errors.tel.message}</p>}
                      </CCol>
                      <CCol>
                        <CFormInput
                          type="email"
                          label="이메일"
                          {...register('email', { required: '이메일을 입력하세요' })}
                          placeholder="test@domain.com"
                        />
                        {errors.email && <p>{errors.email.message}</p>}
                      </CCol>
                    </CRow>
                  </CCol>
                </CCardBody>
                <CCardFooter className="text-end">
                  <CButton type="submit" color="primary">
                    {isEditable ? '수정' : '등록'}
                  </CButton>
                </CCardFooter>
              </CCard>
            </CForm>
          </CTabPanel>
          <CTabPanel className="p-2" itemKey="app">
            <AppManagement userNo={sno} />
          </CTabPanel>
        </CTabContent>
      </CTabs>

      <CModal visible={showModal}>
        <CModalHeader>
          <CModalTitle>{setIsSuccess ? '완료' : 'error'}</CModalTitle>
        </CModalHeader>
        <CModalBody>{modalMsg}</CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setShowModal(false)
              window.location.reload()
            }}
          >
            닫기
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
export default PartnerRegister
