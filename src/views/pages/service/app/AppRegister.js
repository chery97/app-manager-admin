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

const AppRegister = () => {
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
        <strong>앱 등록</strong>
      </CCardHeader>
      <CCardBody></CCardBody>
    </CCard>
  )
}
export default AppRegister
