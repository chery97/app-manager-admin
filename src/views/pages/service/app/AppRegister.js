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
  CRow,
} from '@coreui/react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const AppRegister = () => {
  const { sno } = useParams()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const isEditable = !!sno

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex align-items-center">
        <strong>애플리케이션 등록</strong>
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CRow>
            <CCol md={6} className="mb-4">
              <CFormLabel htmlFor="appName">
                앱 이름 <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput type="text" id="appName" required />
            </CCol>
            <CCol md={6} className="mb-4">
              <CFormLabel htmlFor="appUrl">URL</CFormLabel>
              <CFormInput type="text" id="appUrl" />
            </CCol>
          </CRow>
          <CRow>
            <CCol md={6} className="mb-4">
              <CFormLabel htmlFor="appDesc">설명</CFormLabel>
              <CFormTextarea id="appDesc" />
            </CCol>
            {isEditable && (
              <CCol md={6} className="mb-4">
                <CFormLabel htmlFor="companyName">
                  업체명 <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput type="text" id="companyName" required />
              </CCol>
            )}
          </CRow>
        </CForm>
      </CCardBody>
      <CCardFooter className="text-end">
        <CButton type="submit" color="primary">
          {isEditable ? '수정' : '등록'}
        </CButton>
      </CCardFooter>
    </CCard>
  )
}
export default AppRegister
