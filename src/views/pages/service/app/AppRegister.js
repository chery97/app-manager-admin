import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
} from '@coreui/react'

const AppRegister = () => {
  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex align-items-center">
        <strong>애플리케이션 등록</strong>
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CCol md={4} className="mb-4">
            <CFormLabel htmlFor="appName">애플리케이션 이름</CFormLabel>
            <CFormInput type="text" id="appName" />
          </CCol>
          <CCol md={6}>
            <CFormLabel htmlFor="appDescription">설명</CFormLabel>
            <CFormTextarea id="appDescription" />
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  )
}
export default AppRegister
