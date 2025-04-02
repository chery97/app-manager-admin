import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import app from 'src/api/app'

const AppRegister = () => {
  const { sno } = useParams()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const isEditable = !!sno
  const [showModal, setShowModal] = useState(false)
  const [modalMsg, setModalMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(true)

  const onSubmitDetail = (data) => {
    if (isEditable) {
      updateMutation.mutate({
        appName: data.appName,
        appUrl: data.appUrl,
        appDesc: data.appDesc,
      })
    } else {
      registerMutation.mutate({
        appName: data.appName,
        appUrl: data.appUrl,
        appDesc: data.appDesc,
      })
    }
  }

  const registerMutation = useMutation({
    mutationFn: async (data) => await app.register(data),
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

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex align-items-center">
          <strong>{isEditable ? '앱 정보 수정' : '앱 등록'}</strong>
        </CCardHeader>
        <CForm onSubmit={handleSubmit(onSubmitDetail)}>
          <CCardBody>
            <CRow>
              <CCol md={6} className="mb-4">
                <CFormLabel htmlFor="appName">
                  앱 이름 <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="text"
                  {...register('appName', { required: '앱 이름을 입력하세요' })}
                  readOnly={isEditable}
                />
                {errors.appName && <p>{errors.appName.message}</p>}
              </CCol>
              <CCol md={6} className="mb-4">
                <CFormLabel htmlFor="appUrl">URL</CFormLabel>
                <CFormInput type="text" {...register('appUrl')} />
              </CCol>
            </CRow>
            <CRow>
              <CCol md={6} className="mb-4">
                <CFormLabel htmlFor="appDesc">설명</CFormLabel>
                <CFormTextarea {...register('appDesc')} />
              </CCol>
              {isEditable && (
                <CCol md={6} className="mb-4">
                  <CFormLabel htmlFor="companyName">
                    업체명 <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput type="text" id="companyName" />
                </CCol>
              )}
            </CRow>
          </CCardBody>
          <CCardFooter className="text-end">
            <CButton type="submit" color="primary">
              {isEditable ? '수정' : '등록'}
            </CButton>
          </CCardFooter>
        </CForm>
      </CCard>
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
export default AppRegister
