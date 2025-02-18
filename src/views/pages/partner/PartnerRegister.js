import React, { useEffect, useState } from 'react'
import { CButton, CCol, CForm, CFormInput, CFormSelect, CRow } from '@coreui/react'

const PartnerRegister = () => {
  const [userData, setUserData] = useState({
    id: 'exampleId',
    userName: '테스트',
    userTel: '010-9876-5432',
    managerType: 'partner',
    partnerSno: '888',
    userEmail: 'test@example.com',
  })
  const fetchData = async (params) => {
    try {
    } catch (error) {
      console.error('error:', error)
    }
  }
  useEffect(() => {
    // fetchData(params)
  }, [])

  const handleChange = (e) => {
    const { id, value } = e.target
    setUserData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }
  const handleSubmit = async (e) => {}

  return (
    <CForm className="row g-3" onSubmit={handleSubmit}>
      <CRow>
        <CCol className="bg-dark p-3">
          <CRow className="mb-3">
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
          <CRow className="mb-3">
            <CCol>
              <CFormSelect
                id="managerType"
                label="타입"
                value={userData.managerType}
                style={{ width: '100%' }}
                onChange={handleChange}
                readOnly
              >
                <option value="partner">파트너</option>
                <option value="admin">관리자</option>
              </CFormSelect>
            </CCol>
            <CCol>
              <CFormInput
                id="partnerSno"
                label="파트너명"
                value={userData.partnerSno}
                placeholder="input Partner's Name"
                style={{ width: '100%' }}
                onChange={handleChange}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CFormInput
                id="userEmail"
                label="이메일"
                value={userData.userEmail}
                placeholder="test@domain.com"
                style={{ width: '100%' }}
                onChange={handleChange}
              />
            </CCol>
          </CRow>
        </CCol>

        <CCol className="bg-dark p-3"></CCol>

        <CCol xs={12} className="mt-3">
          <CButton color="primary" type="submit">
            저장
          </CButton>
        </CCol>
      </CRow>
    </CForm>
  )
}
export default PartnerRegister
