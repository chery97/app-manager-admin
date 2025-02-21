import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

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

const PartnerRegister = () => {
  const { sno } = useParams()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm()

  const userType = watch('userType')

  useEffect(() => {
    const fetchData = async (sno) => {
      try {
        const { data } = await user.findOne(Number(sno))
        Object.keys(data).forEach((key) => setValue(key, data[key]))
      } catch (error) {
        console.error('error:', error)
      }
    }
    fetchData(sno)
  }, [sno])

  const onSubmit = (data) => {
    console.log('제출 데이터 확인:', data)
  }

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex align-items-center">
        <CTabs activeItemKey="detail">
          <CTabList variant="tabs">
            <CTab itemKey="detail">
              <strong>파트너 등록</strong>
            </CTab>
            <CTab itemKey="app">
              <strong>앱 관리</strong>
            </CTab>
          </CTabList>
          <CTabContent>
            <CTabPanel className="p-3" itemKey="detail">
              <CCardBody>
                <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                  <CCol className="bg-dark p-3">
                    <CRow>
                      <CCol>
                        <CFormInput
                          type="text"
                          label="아이디"
                          {...register('id', { required: '아이디를 입력하세요' })}
                        />
                        {errors.id && <p>{errors.id.message}</p>}
                      </CCol>
                      <CCol>
                        <CFormInput
                          type="text"
                          label="이름"
                          {...register('name', { required: '이름을 입력하세요' })}
                        />
                        {errors.name && <p>{errors.name.message}</p>}
                      </CCol>
                      <CCol>
                        <CFormInput
                          label="연락처"
                          {...register('tel', { required: '연락처를 입력하세요' })}
                          placeholder="01012345678"
                        />
                        {errors.tel && <p>{errors.tel.message}</p>}
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormSelect label="타입" {...register('userType')}>
                          <option value="partner">파트너</option>
                          <option value="admin">관리자</option>
                        </CFormSelect>
                      </CCol>
                      {userType === 'partner' && (
                        <CCol>
                          <CFormInput
                            label="파트너명"
                            {...register('partnerSno', { required: '파트너명을 입력하세요' })}
                            placeholder="input PartnerManagement's Name"
                          />
                          {errors.partnerSno && <p>{errors.partnerSno.message}</p>}
                        </CCol>
                      )}
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="이메일"
                          {...register('email', { required: '이메일을 입력하세요' })}
                          placeholder="test@domain.com"
                        />
                        {errors.email && <p>{errors.email.message}</p>}
                      </CCol>
                    </CRow>
                  </CCol>

                  <CCol xs={12} className="mt-3 d-flex align-items-center">
                    <CButton color="primary" type="submit" className="ms-auto">
                      저장
                    </CButton>
                  </CCol>
                </CForm>
              </CCardBody>
            </CTabPanel>
            <CTabPanel className="p-3" itemKey="app">
              <CCardBody>
                <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                  <CCol className="bg-dark p-3">
                    <CRow>
                      <CCol>
                        <CFormInput
                          label="아이디"
                          {...register('id')}
                          style={{ width: '100%' }}
                          readOnly
                        />
                      </CCol>
                      <CCol>
                        <CFormInput
                          type="text"
                          label="이름"
                          {...register('name')}
                          style={{ width: '100%' }}
                        />
                      </CCol>
                      <CCol>
                        <CFormInput
                          label="연락처"
                          {...register('tel')}
                          placeholder="01012345678"
                          style={{ width: '100%' }}
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
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </CCardHeader>
    </CCard>
  )
}
export default PartnerRegister
