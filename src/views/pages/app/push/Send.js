import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import push from 'src/api/push'
import { useDialog } from 'src/context/Dialogcontext'
import { useNavigate } from 'react-router-dom'

const Send = () => {
  const [selectedTarget, setSelectedTarget] = useState('전체')
  const {
    register, // 입력 필드와 연결
    handleSubmit, // 폼 제출 핸들러
    watch, // 현재 입력값을 추적
    formState: { errors }, // 입력값 검증 에러 관리
  } = useForm()
  const navigate = useNavigate()
  const totalMembers = 47352

  const { confirm } = useDialog()

  const handleModal = async (data) => {
    const result = await confirm({
      message: data.message,
      buttons: [{ label: '확인', value: true, color: 'primary' }],
    })
    if (result) {
      navigate(0) // 현재 경로 다시 로드
    }
  }

  const FnPushSend = async (pushData) => {
    const response = await push.sendPush(pushData)
    return response.data
  }

  const pushSendMutation = useMutation({
    mutationFn: FnPushSend,
    onSuccess: async (data) => {
      await handleModal(data) // 모달 띄운 후 새로고침
    },
    onError: async (error) => {
      await handleModal(error?.response?.data) // 모달 띄운 후 새로고침
    },
  })

  const handleSend = (data) => {
    const testData = {
      appName: 'appPrototype',
      topic: 'ALL',
      title: data.pushTitle,
      message: data.pushContents,
    }
    pushSendMutation.mutate(testData)
  }

  return (
    <CForm className="align-items-center" onSubmit={handleSubmit(handleSend)}>
      <CCard className="mb-4">
        <CCardHeader className="d-flex align-items-center">
          <strong>조건 설정</strong>
        </CCardHeader>
        <CCardBody>
          <CCardText className="mb-0">
            • 전체 대상으로 발송 시 로그인 상태와 상관없이 앱을 설치한 모든 유저에게 푸시가
            발송됩니다.
          </CCardText>
          <CCardText className="mb-0">
            • 특정 회원에게 발송 시 선택된 회원의 계정이 로그인 되어있는 모든 앱에 푸시가
            발송됩니다.
          </CCardText>
          <CCardText>
            • 다만, 발송 OS, 앱 설치 여부, 앱 알림 수신 동의 여부에 따라 수신 대상에서 제외될 수
            있습니다.
          </CCardText>
          <CCard className="overflow-hidden border-light-subtle">
            <CContainer className="mx-0">
              <CRow className="align-items-center border-bottom border-light-subtle">
                <CCol md={2} className="bg-light p-2 align-items-center">
                  <CFormLabel className="mb-0">발송 목적</CFormLabel>
                </CCol>
                <CCol md={10}>
                  <CFormCheck inline type="radio" label="광고성" name="purpose" defaultChecked />
                  <CFormCheck inline type="radio" label="정보성" name="purpose" />
                </CCol>
              </CRow>
              <CRow className="align-items-center border-bottom border-light-subtle">
                <CCol md={2} className="bg-light p-2">
                  <CFormLabel className="text-danger mb-0">* 수신 대상</CFormLabel>
                </CCol>
                <CCol md={10}>
                  <CFormCheck
                    inline
                    type="radio"
                    label="전체"
                    name="target"
                    checked={selectedTarget === '전체'}
                    onChange={() => setSelectedTarget('전체')}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    label="회원 선택"
                    name="target"
                    checked={selectedTarget === '회원 선택'}
                    onChange={() => setSelectedTarget('회원 선택')}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    label="그룹 선택"
                    name="target"
                    checked={selectedTarget === '그룹 선택'}
                    onChange={() => setSelectedTarget('그룹 선택')}
                  />
                  <span className="ms-2 text-primary">회원 총 {totalMembers}명 선택</span>
                </CCol>
              </CRow>
              <CRow className="align-items-center border-bottom border-light-subtle">
                <CCol md={2} className="bg-light p-2">
                  <CFormLabel>발송 OS</CFormLabel>
                </CCol>
                <CCol md={10}>
                  <CFormCheck inline type="radio" label="전체" name="os" defaultChecked />
                  <CFormCheck inline type="radio" label="Android" name="os" />
                  <CFormCheck inline type="radio" label="iOS" name="os" />
                </CCol>
              </CRow>
              <CRow className="align-items-center">
                <CCol md={2} className="bg-light p-2">
                  <CFormLabel>발송 유형</CFormLabel>
                </CCol>
                <CCol md={10}>
                  <CFormCheck
                    inline
                    type="radio"
                    label="즉시 발송"
                    name="sendType"
                    defaultChecked
                  />
                  <CFormCheck inline type="radio" label="예약 발송" name="sendType" />
                  <CFormCheck inline type="radio" label="반복 발송" name="sendType" />
                </CCol>
              </CRow>
            </CContainer>
          </CCard>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader className="d-flex align-items-center">
          <strong>메시지 설정</strong>
        </CCardHeader>
        <CCardBody>
          <CCardText className="mb-0">
            • 광고성 정보를 발송하는 경우 법적 준수 사항을 지켜서 발송해야 합니다.
          </CCardText>
          <CCardText>• 야간(21시 ~ 08시) 발송은 사일런트 푸시로 발송됩니다.</CCardText>
          <CCard className="overflow-hidden border-light-subtle">
            <CContainer className="mx-0">
              <CRow className="align-items-center border-bottom border-light-subtle">
                <CCol md={2} className="bg-light p-4 align-items-center">
                  <CFormLabel className="">* 푸시 제목</CFormLabel>
                </CCol>
                <CCol md={10}>
                  <CFormInput
                    type="text"
                    id="pushTitle"
                    placeholder="맛집 BEST 3"
                    {...register('pushTitle', { required: '푸시 제목을 입력하세요.' })}
                  />
                </CCol>
              </CRow>
              <CRow className="align-items-center border-bottom border-light-subtle">
                <CCol
                  md={2}
                  className="d-flex align-items-center bg-light p-4"
                  style={{ height: '170px' }}
                >
                  <CFormLabel className="text-danger">* 푸시 내용</CFormLabel>
                </CCol>
                <CCol md={10}>
                  <CFormTextarea
                    className="my-2"
                    placeholder="요즘 핫한 파인다이닝"
                    aria-label="Disabled textarea example"
                    style={{ height: '130px' }}
                    {...register('pushContents', { required: '푸시 내용을 입력하세요.' })}
                  ></CFormTextarea>
                </CCol>
              </CRow>
              <CRow className="align-items-center border-bottom border-light-subtle">
                <CCol md={2} className="bg-light p-4 align-items-center">
                  <CFormLabel>* 수신 동의 철회 방법</CFormLabel>
                </CCol>
                <CCol md={10}>
                  <CFormInput
                    type="text"
                    id="canclePushAgreement"
                    placeholder="수신거부: 설정 > 알림 OFF"
                  />
                </CCol>
              </CRow>
              <CRow className="align-items-center border-bottom border-light-subtle">
                <CCol md={2} className="bg-light p-4 align-items-center">
                  <CFormLabel>이미지</CFormLabel>
                </CCol>
                <CCol md={10}>
                  <CInputGroup className="w-25">
                    <CFormInput type="file" id="inputGroupFile02" />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow className="align-items-center">
                <CCol md={2} className="bg-light p-4">
                  <CFormLabel>URL</CFormLabel>
                </CCol>
                <CCol md={10}>
                  <CFormInput
                    type="text"
                    id="canclePushAgreement"
                    placeholder="https://naver.com"
                  />
                  <CCardText>• 입력되지 않은 푸시는 메인페이지로 이동됩니다.</CCardText>
                </CCol>
              </CRow>
            </CContainer>
          </CCard>
        </CCardBody>
      </CCard>
      <div className="d-flex justify-content-end mb-4">
        <CButton type="submit" color="primary" size="lg">
          발송
        </CButton>
      </div>
    </CForm>
  )
}

export default Send
