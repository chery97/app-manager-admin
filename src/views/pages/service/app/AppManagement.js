import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
} from '@coreui/react'
import { useParams } from 'react-router-dom'
import user from 'src/api/user'

const AppManagement = () => {
  const { sno } = useParams()
  const [userData, setUserData] = useState({
    id: 'exampleId',
    userName: '테스트',
    userTel: '010-9876-5432',
    managerType: 'partner',
    partnerSno: '888',
    userEmail: 'test@example.com',
  })
  const fetchData = async (sno) => {
    try {
      const { data } = await user.findOne(sno)
      // setUserData(data)
    } catch (error) {
      console.error('error:', error)
    }
  }
  useEffect(() => {
    // fetchData(sno)
  }, [sno])

  const handleChange = (e) => {
    const { id, value } = e.target
    setUserData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }
  const handleSubmit = async (e) => {}

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex align-items-center">
        <strong>파트너 관리</strong>
      </CCardHeader>
      <CCardBody>
        <CForm className="row g-3" onSubmit={handleSubmit}>
          <CCol className="bg-dark p-3">
            <CRow>
              <CCol>
                <CFormInput
                  type="email"
                  id="id"
                  label="아이디"
                  value={userData.id}
                  style={{ width: '100%' }}
                  readOnly
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="text"
                  id="userName"
                  label="이름"
                  value={userData.userName}
                  style={{ width: '100%' }}
                  onChange={handleChange}
                />
              </CCol>
              <CCol>
                <CFormInput
                  id="userTel"
                  label="연락처"
                  value={userData.userTel}
                  placeholder="01012345678"
                  style={{ width: '100%' }}
                  onChange={handleChange}
                />
              </CCol>
            </CRow>
          </CCol>
          <CCol className="bg-dark p-3"></CCol>
          <CCol xs={12} className="mt-3 d-flex align-items-center">
            <CButton color="primary" type="submit" className="ms-auto">
              저장
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  )
}
export default AppManagement
