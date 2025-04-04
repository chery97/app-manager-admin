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
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
} from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import intro from 'src/api/app'
import upload from 'src/api/upload'
import { useDialog } from 'src/context/Dialogcontext'
import { useNavigate } from 'react-router-dom'
import app from 'src/api/app'

const Intro = () => {
  const defaultValues = {
    appId: '',
    duration: '',
    mobileImgUrl: '',
    mobileImgUrlText: '',
    tabletImgUrl: '',
    tabletImgUrlText: '',
  }

  const introStateDefaultValues = {
    appId: '',
    duration: '',
    mobileImgUrl: null,
    tabletImgUrl: null,
  }
  const [designIntro, setDesignIntro] = useState({
    ...introStateDefaultValues,
  })
  const mobileFileInputRef = useRef(null)
  const tableFileInputRef = useRef(null)
  const navigate = useNavigate()

  const {
    register, // 입력 필드와 연결
    handleSubmit, // 폼 제출 핸들러
    setValue,
    watch, // 현재 입력값을 추적
    reset,
    formState: { errors }, // 입력값 검증 에러 관리
  } = useForm({
    defaultValues,
  })

  const { confirm } = useDialog()

  const handleModal = (data) => {
    return confirm({
      message: data.message,
      buttons: [{ label: '확인', value: true, color: 'primary' }],
    })
  }

  const selectedApp = watch('appId', '') // 앱 기본 선택값을 빈 값으로 설정

  const createIntro = async (data) => {
    const result = await intro.create(data)
    return result.data
  }

  const updateIntro = async (data) => {
    const result = await intro.update(data)
    return result.data
  }

  const getIntro = async (appId) => {
    const result = await intro.getIntro(appId)
    return result.data?.[0] ?? null
  }

  const getAppList = async () => {
    const result = await app.findAll()
    return result.data.items
  }

  const { data: appList } = useQuery({
    queryKey: ['appList'],
    queryFn: () => getAppList(),
  })

  const {
    data: introData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['intro'],
    queryFn: () => getIntro(selectedApp), // 서버에서 초기 데이터 가져오기
    enabled: !!selectedApp,
  })

  // 앱선택시 refetch 실행
  useEffect(() => {
    if (selectedApp === '') {
      reset()
      setDesignIntro({ ...introStateDefaultValues })
    } else {
      refetch().then(({ data }) => {
        setDesignIntro(() => ({
          mobileImgUrl: data?.mobileImgUrl,
          tabletImgUrl: data?.tabletImgUrl ?? null,
        }))
        setValue('mobileImgUrlText', data?.mobileImgUrl)
        setValue('tabletImgUrlText', data?.tabletImgUrl)
        setValue('duration', data?.duration)
      }) // selectedApp 변경 후 API 재호출
    }
  }, [selectedApp])

  const introMutation = useMutation({
    mutationFn: introData ? updateIntro : createIntro,
    onSuccess: (data) => {
      handleModal({ message: '저장되었습니다.' }).then(() => {
        navigate('/app/design/intro')
      })
    },
    onError: (error) => {
      handleModal({ message: '저장에 실패하였습니다. 다시 시도해주세요' }).then(() => {
        navigate('/app/design/intro')
      })
    },
  })

  const onSubmit = (formData) => {
    introMutation.mutate({
      appId: selectedApp,
      mobileImgUrl: formData.mobileImgUrl,
      tabletImgUrl: formData.tabletImgUrl,
      duration: Number(formData.duration),
    })
  }

  const onError = (errors) => {
    if (Object.values(errors).length > 0) {
      handleModal({ message: Object.values(errors)[0].message }) // 오류 메시지에 대한 alert 발생
    }
  }

  const imageUpload = async (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    const fileType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] // 허용할 이미지 타입
    const maxSize = 5 * 1024 * 1024 // 5MB 제한

    // 파일 형식 검사
    if (!fileType.includes(file.type)) {
      alert('허용되지 않은 파일 형식입니다. (jpg, png, gif, webp만 가능)')
      return
    }

    // 파일 크기 검사
    if (file.size > maxSize) {
      alert('파일 크기가 5MB를 초과합니다.')
      return
    }
    // 미리보기
    const reader = new FileReader()
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('file', file)

    try {
      // s3 업로드
      const res = await upload.uploadFile(formData)

      if (res.data?.filePath) {
        if (e.target.id === 'mobileImgUrl') {
          setValue('mobileImgUrl', res.data.filePath)
          setValue('mobileImgUrlText', res.data.filePath)
          setDesignIntro((prevState) => ({
            ...prevState,
            mobileImgUrl: res.data.filePath,
          }))
        } else {
          setValue('tabletImgUrl', res.data.filePath)
          setValue('tabletImgUrlText', res.data.filePath)
          setDesignIntro((prevState) => ({
            ...prevState,
            tabletImgUrl: res.data.filePath,
          }))
        }
      } else {
        console.error('S3 업로드 실패')
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error)
    }
  }

  return (
    <CCard className="mb-4 ">
      <CCardHeader>
        <strong>인트로 설정</strong>
      </CCardHeader>
      <CCardBody className="d-flex">
        <CRow className="m-4 w-100">
          <CCol
            md={2}
            className="w-50 bg-light-subtle p-2 align-items-center"
            style={{ borderRadius: '10px' }}
          >
            <CTabs activeItemKey="mobile">
              <CTabList variant="tabs" className="border-bottom border-light-subtle">
                <CTab itemKey="mobile">
                  <strong>Mobile</strong>
                </CTab>
                <CTab itemKey="tablet">
                  <strong>Tablet</strong>
                </CTab>
              </CTabList>
              <CTabContent>
                <CTabPanel className="p-3" itemKey="mobile">
                  <CCardBody className="d-flex position-relative">
                    <CCol
                      style={{
                        width: '320px',
                        height: '640px',
                        background: `url('./src/assets/images/iphone15.png') no-repeat center`,
                        backgroundSize: 'contain',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 2,
                      }}
                    >
                      {designIntro && (
                        <CImage
                          src={designIntro.mobileImgUrl}
                          thumbnail={false}
                          style={{
                            width: '275px',
                            height: '590px',
                            borderRadius: '40px',
                            position: 'absolute',
                            zIndex: 1,
                          }}
                        />
                      )}
                    </CCol>
                  </CCardBody>
                </CTabPanel>
                <CTabPanel className="p-3" itemKey="tablet">
                  <CCardBody className="d-flex">
                    <CCol
                      style={{
                        width: '512px',
                        height: '683px',
                        background: `url('./src/assets/images/tablet.png') no-repeat center`,
                        backgroundSize: 'contain',
                        padding: '40px 15px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {designIntro && (
                        <CImage
                          src={designIntro?.tabletImgUrl}
                          thumbnail={false}
                          style={{
                            width: '420px',
                            height: '560px',
                          }}
                        />
                      )}
                    </CCol>
                  </CCardBody>
                </CTabPanel>
              </CTabContent>
            </CTabs>
          </CCol>
          <CCol className="w-25 mx-4">
            <CForm id="introForm" onSubmit={handleSubmit(onSubmit, onError)}>
              <CInputGroup>
                <CContainer>
                  <CRow>
                    <CCol md={5} className="p-2 d-flex align-items-center">
                      <CFormLabel className="col-form-label" htmlFor="mobileImgUrl">
                        앱 선택
                      </CFormLabel>
                    </CCol>
                    <CCol md={6} className="d-flex align-items-center">
                      <CFormSelect
                        id="appId"
                        aria-label="Default select example"
                        {...register('appId', {
                          required: '앱을 선택해주세요',
                        })}
                        options={[
                          { label: '선택', value: '' }, // 기본 옵션 추가
                          ...(Array.isArray(appList)
                            ? appList.map((app) => ({ label: app.appName, value: app.sno }))
                            : []),
                        ]}
                        onChange={(e) => {
                          const newValue = e.target.value
                          setValue('appId', newValue, { shouldValidate: true }) // 값 설정 + 검증 트리거
                        }}
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mt-lg-5 d-flex flex-column border-bottom">
                    <CCol>
                      <p className="text-warning mb-0">&#8251; 이미지 업로드시 주의사항</p>
                      <p style={{ fontSize: '15px' }}>
                        표기된 이미지 사이즈에 맞춰 업로드해주시기 바랍니다.
                      </p>
                    </CCol>
                  </CRow>
                  {selectedApp && (
                    <>
                      <CRow
                        className="pt-2 pb-2 align-items-center"
                        style={{ justifyContent: 'center' }}
                      >
                        <CRow>
                          <>
                            <CCol sm={6} className="p-2 d-flex align-items-center">
                              <CFormLabel htmlFor="mobileImgUrl">
                                모바일 이미지 업로드 (320 x 640)
                              </CFormLabel>
                            </CCol>
                            <CCol sm={6} className="d-flex align-items-center">
                              <CFormInput
                                type="text"
                                id="mobileImgUrlText"
                                {...register('mobileImgUrlText', {
                                  required: '모바일 이미지를 업로드해주세요.',
                                })}
                                placeholder="선택된 파일 없음"
                                readOnly
                                className="me-2"
                              />
                              <CFormInput
                                type="file"
                                id="mobileImgUrl"
                                onChange={imageUpload}
                                ref={mobileFileInputRef}
                                style={{ display: 'none' }}
                              />
                              <CButton
                                type="button"
                                onClick={() => mobileFileInputRef.current.click()}
                                color="primary"
                                style={{ width: '130px', whiteSpace: 'nowrap' }}
                              >
                                파일 선택
                              </CButton>
                            </CCol>
                          </>
                        </CRow>
                        <CRow>
                          <>
                            <CCol sm={6} className="p-2 d-flex align-items-center">
                              <CFormLabel htmlFor="tabletImgUrl">
                                테블릿 이미지 업로드 (510 x 680)
                              </CFormLabel>
                            </CCol>
                            <CCol sm={6} className="d-flex align-items-center">
                              <CFormInput
                                type="text"
                                id="tabletImgUrlText"
                                {...register('tabletImgUrlText', {
                                  required: '태블릿 이미지를 업로드해주세요.',
                                })}
                                placeholder="선택된 파일 없음"
                                readOnly
                                className="me-2"
                              />
                              <CFormInput
                                type="file"
                                id="tabletImgUrl"
                                onChange={imageUpload}
                                ref={tableFileInputRef}
                                style={{ display: 'none' }}
                              />
                              <CButton
                                type="button"
                                onClick={() => tableFileInputRef.current.click()}
                                color="primary"
                                style={{ width: '130px', whiteSpace: 'nowrap' }}
                              >
                                파일 선택
                              </CButton>
                            </CCol>
                          </>
                        </CRow>
                        <CRow>
                          <CCol sm={6} className="p-2 d-flex align-items-center">
                            <CFormLabel htmlFor="duration">지속시간</CFormLabel>
                          </CCol>

                          <CCol sm={6} className="d-flex align-items-center">
                            <CFormSelect
                              type="select"
                              id="duration"
                              onChange={(e) => {
                                // setDesignIntro((data) => ({ duration: e.target.value }))
                                setValue('duration', e.target.value, { shouldValidate: true })
                              }} // 변경 시 상태 업데이트
                              options={[
                                { label: '선택', value: '', disabled: true },
                                { label: '3s', value: '3' },
                                { label: '4s', value: '4' },
                                { label: '5s', value: '5' },
                              ]}
                              {...register('duration', {
                                required: '지속시간을 선택해주세요.',
                              })}
                            />
                          </CCol>
                        </CRow>
                      </CRow>
                    </>
                  )}
                </CContainer>
              </CInputGroup>
            </CForm>
          </CCol>
        </CRow>
      </CCardBody>
      <CCardFooter className="text-end">
        <CButton type="submit" form="introForm" color="primary">
          {introData ? '수정' : '저장'}
        </CButton>
      </CCardFooter>
    </CCard>
  )
}

export default Intro
