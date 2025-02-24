import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CImage,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import React, { createRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import intro from 'src/api/app/intro'
import upload from 'src/api/upload'

const Intro = () => {
  const [showImage, setShowImage] = useState()
  const [mobileImage, setMobileImage] = useState()
  const [tabletImage, setTabletImage] = useState()
  const [showModal, setShowModal] = useState(false) // 모달 노출 상태값
  const [modalMsg, setModalMsg] = useState('') // 모달 메세지
  const [isSuccess, setIsSuccess] = useState(true) // 인트로 설정 성공 상태값

  const {
    register, // 입력 필드와 연결
    handleSubmit, // 폼 제출 핸들러
    watch, // 현재 입력값을 추적
    formState: { errors }, // 입력값 검증 에러 관리
  } = useForm()

  const createIntro = async (data) => {
    const result = await intro.create(data)
    return result.data
  }

  const introMutation = useMutation({
    mutationFn: createIntro,
    onSuccess: (data) => {
      setModalMsg('저장되었습니다.')
      setIsSuccess(true)
      setShowModal(true)
    },
    onError: (error) => {
      setModalMsg('저장에 실패하였습니다. 다시 시도해주세요')
      setIsSuccess(false)
      setShowModal(true)
    },
  })

  const onSubmit = (data) => {
    introMutation.mutate({
      mobileImgUrl: mobileImage,
      tabletImgUrl: tabletImage,
      duration: data.duration,
    })
  }

  const imageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileType = ['image/jpeg', 'image/png', 'image/gif'] // 허용할 이미지 타입
    const maxSize = 5 * 1024 * 1024 // 5MB 제한

    // 파일 형식 검사
    if (!fileType.includes(file.type)) {
      alert('허용되지 않은 파일 형식입니다. (jpg, png, gif만 가능)')
      return
    }

    // 파일 크기 검사
    if (file.size > maxSize) {
      alert('파일 크기가 5MB를 초과합니다.')
      return
    }

    // 미리보기
    const reader = new FileReader()
    reader.onloadend = () => setShowImage(reader.result)
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('file', file)

    try {
      // s3 업로드
      const res = await upload.uploadFile(formData)

      if (res.data?.filePath) {
        if (e.target.id === 'mobileImgUrl') {
          setMobileImage(res.data.filePath)
        } else {
          setTabletImage(res.data.filePath)
        }
      } else {
        console.error('S3 업로드 실패')
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error)
    }
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>인트로 설정</strong>
      </CCardHeader>
      <CCardBody className="d-flex">
        <CRow className="m-4">
          <CCol
            style={{
              width: '320px',
              height: '640px',
              background: `url('./src/assets/images/iphone15.png') no-repeat center`,
              backgroundSize: 'contain',
              padding: '40px 15px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CImage
              src={showImage}
              thumbnail={false}
              style={{
                width: '60%',
                height: '80%',
              }}
            />
          </CCol>
          <CCol>
            <CForm id="introForm" onSubmit={handleSubmit(onSubmit)}>
              <CInputGroup>
                <CContainer>
                  <CRow>
                    <CFormLabel htmlFor="mobileImgUrl" className="col-sm-6 col-form-label">
                      모바일 이미지 업로드
                    </CFormLabel>
                    <CCol className="mb-4">
                      <CFormInput
                        type="file"
                        id="mobileImgUrl"
                        {...register('mobileImgUrl', {
                          required: '모바일 이미지를 업로드해주세요.',
                        })}
                        onChange={imageUpload}
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CFormLabel htmlFor="tabletImgUrl" className="col-sm-6 col-form-label">
                      테블릿 이미지 업로드
                    </CFormLabel>
                    <CCol className="mb-4">
                      <CFormInput
                        type="file"
                        id="tabletImgUrl"
                        {...register('tabletImgUrl', {
                          required: '테블릿 이미지를 업로드해주세요.',
                        })}
                        onChange={imageUpload}
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CFormLabel htmlFor="duration" className="col-sm-6 col-form-label">
                      지속시간
                    </CFormLabel>
                    <CCol className="mb-4">
                      <CFormSelect
                        type="select"
                        id="duration"
                        options={[
                          { label: '선택', value: '', disabled: true },
                          { label: '3s', value: '3' },
                          { label: '4s', value: '4' },
                          { label: '5s', value: '5' },
                        ]}
                        {...register('duration', { required: '지속시간을 설정해주세요.' })}
                      />
                    </CCol>
                  </CRow>
                </CContainer>
              </CInputGroup>
            </CForm>
          </CCol>
        </CRow>
      </CCardBody>
      <CCardFooter className="text-end">
        <CButton type="submit" form="introForm" color="primary">
          저장
        </CButton>
      </CCardFooter>
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
                navigate('/app/design/intro')
              }
            }}
          >
            {'확인'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default Intro
