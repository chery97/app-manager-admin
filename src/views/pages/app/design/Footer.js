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
  CRow,
} from '@coreui/react'
import { cilPlus } from '@coreui/icons'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import footer from 'src/api/app/footer'
import upload from 'src/api/upload'
import { useDialog } from 'src/context/Dialogcontext'
import CIcon from '@coreui/icons-react'
import app from 'src/api/app'

const Footer = () => {
  const [imageInputs, setImageInputs] = useState([{ id: '0' }])
  const [isSuccess, setIsSuccess] = useState(true) // 인트로 설정 성공 상태값
  const [tabList, setTabList] = useState([
    {
      id: '0',
      label: '홈',
      image: 'https://geek-app-storage.s3.ap-northeast-2.amazonaws.com/icon/icon_home.svg',
      landingUrl: '',
    },
  ]) // 탭 리스트 초기 상태값
  const tabImageUrlInputRef = useRef([])

  const {
    register, // 입력 필드와 연결
    handleSubmit, // 폼 제출 핸들러
    watch, // 현재 입력값을 추적
    setValue,
    getValues,
    formState: { errors }, // 입력값 검증 에러 관리
  } = useForm()

  const selectedApp = watch('app', '') // 앱 기본 선택값을 빈 값으로 설정

  const { confirm } = useDialog()

  const handleModal = (data) => {
    return confirm({
      message: data.message,
      buttons: [{ label: '확인', value: true, color: 'primary' }],
    })
  }

  const updateTabList = async (data) => {
    if (selectedApp === '') {
      handleModal({ message: '앱을 먼저 선택해주세요.' })
    }
    const updateData = {
      appId: selectedApp,
      tabData: JSON.stringify(data.tabList),
    }
    const result = await footer.update(updateData)
    return result.data
  }

  const getTabList = async (appId) => {
    if (!appId) return [] // 앲이 선택되지 않으면 API 요청 X
    try {
      const { data } = await footer.getFooter({ appId }) // 선택한 앱 Id로 백엔드 호출
      setTabList(data) // 가져온 데이터 설정 (없으면 빈 배열)

      // 탭 이미지값이 이미 있는 경우 setValue
      data.forEach((item) => {
        setValue(`tabImageUrl-${item.id}`, item.image)
      })

      return data
    } catch (e) {
      alert(e.message)
      location.reload()
    }
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
    data: tabListData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tabList'],
    queryFn: () => getTabList(Number(selectedApp)),
  })

  // 앱선택시 refetch 실행
  useEffect(() => {
    if (selectedApp === '') {
      setTabList([]) // 디폴트 선택시 빈 배열 설정
    } else {
      refetch() // selectedApp 변경 후 API 재호출
    }
  }, [selectedApp])

  const tabListMutation = useMutation({
    mutationFn: updateTabList,
    onSuccess: (data) => {
      setIsSuccess(true)
      handleModal({ message: data.message }).then((result) => {
        if (result) {
          location.reload()
        }
      })
    },
    onError: (error) => {
      setIsSuccess(false)
      handleModal({ message: error.message }).then((result) => {
        if (result) {
          location.reload()
        }
      })
    },
  })

  const onSubmit = () => {
    return
    tabListMutation.mutate({
      tabList,
    })
  }

  const imageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileType = ['image/png', 'image/svg+xml'] // 허용할 이미지 타입
    const maxSize = 5 * 1024 * 1024 // 5MB 제한

    // 파일 형식 검사
    if (!fileType.includes(file.type)) {
      alert('허용되지 않은 파일 형식입니다. (png, svg만 가능)')
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
        const index = e.target.dataset.index
        setTabList((prevState) =>
          prevState.map((item) =>
            item.id === index ? { ...item, image: res.data.filePath } : item,
          ),
        )
        // 탭 이미지 url setvalue
        setValue(`tabImageUrl-${index}`, res.data.filePath)
      } else {
        console.error('S3 업로드 실패')
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error)
    }
  }

  // 탭리스트 추가 이벤트
  const addTabList = () => {
    // 선택된 앱이 없는경우 알럿
    if (selectedApp === '') {
      handleModal({ message: '앱을 먼저 선택해 주세요.' })
      return
    }

    // 하단탭 5개까지만 등록
    if (tabList.length < 5) {
      setImageInputs([...imageInputs, { id: tabList.length.toString() }])
      setTabList([
        ...tabList,
        {
          id: `${tabList.length}`,
          label: '홈',
          image: 'https://geek-app-storage.s3.ap-northeast-2.amazonaws.com/icon/icon_home.svg',
          landingUrl: '',
        },
      ])
    } else {
      handleModal({ message: '5개까지만 등록 가능합니다.' })
    }
  }

  // 탭리스트 제거 이벤트
  const removeTabList = (id) => {
    setImageInputs(imageInputs.filter((input) => input.id !== id))
    setTabList(tabList.filter((input) => input.id !== id))
  }

  // input 포커스 아웃시 상태값 변경 이벤트
  const handleBlur = (type, id, value) => {
    if (type === 'label') {
      setTabList((prevTabList) =>
        prevTabList.map((item) => (item.id === id ? { ...item, label: value } : item)),
      )
    } else {
      setTabList((prevTabList) =>
        prevTabList.map((item) => (item.id === id ? { ...item, landingUrl: value } : item)),
      )
    }
  }

  return (
    <CCard className="mb-4 ">
      <CCardHeader>
        <strong>하단탭 설정</strong>
      </CCardHeader>
      <CCardBody className="d-flex">
        <CRow className="m-4 w-100">
          <CCol
            md={2}
            className="w-50 bg-light-subtle p-2 align-items-center"
            style={{ borderRadius: '10px' }}
          >
            <CCardBody className="d-flex position-relative">
              <CCol
                className="d-flex flex-column justify-content-center align-items-center position-relative z-2"
                style={{
                  width: '320px',
                  height: '640px',
                  background: `url('./src/assets/images/iphone15.png') no-repeat center`,
                  backgroundSize: 'contain',
                }}
              >
                <CImage
                  src={tabListData?.mobileImgUrl}
                  thumbnail={false}
                  className="bg-white position-absolute overflow-hidden start-50"
                  style={{
                    width: '270px',
                    height: '535px',
                    borderTopLeftRadius: '30px', // 상단 왼쪽 둥글게
                    borderTopRightRadius: '30px', // 상단 오른쪽 둥글게
                    borderBottomLeftRadius: '0px', // 하단 직각
                    borderBottomRightRadius: '0px', // 하단 직각
                    top: '30px',
                    transform: 'translateX(-50%)',
                  }}
                />
                <div
                  className="d-flex flex-row align-items-center position-absolute text-center border-top-1"
                  style={{
                    justifyContent: tabList.length < 2 ? 'center' : 'space-between', // 버튼 간 간격을 동일하게 배치
                    width: '270px',
                    height: '45px',
                    bottom: '30px' /* 핸드폰 화면의 하단에 배치 */,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#fff',
                    borderColor: '#ccc',
                    borderRadius: '0 0 30px 30px',
                    padding: '0 10px',
                  }}
                >
                  {tabList?.map((item) => (
                    <div key={item.id} className="d-flex flex-column align-items-center">
                      <img src={item.image} width={20} height={20} alt={item.id} />
                      <span style={{ color: '#000', fontSize: '11px' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </CCol>
            </CCardBody>
          </CCol>
          <CCol className="w-25 mx-4">
            <CForm id="introForm" onSubmit={handleSubmit(onSubmit)}>
              <CInputGroup>
                <CContainer>
                  <CRow>
                    <CFormLabel className="col-sm-2 col-form-label">앱 선택</CFormLabel>
                    <CFormSelect
                      aria-label="Default select example"
                      options={[
                        { label: '선택', value: '' },
                        ...(Array.isArray(appList)
                          ? appList.map((app) => ({ label: app.appName, value: app.sno }))
                          : []),
                      ]}
                      value={selectedApp}
                      onChange={(e) => {
                        const newValue = e.target.value
                        setValue('app', newValue, { shouldValidate: true }) // 값 설정 + 검증 트리거

                        if (newValue === '') {
                          setTabList([]) // 디폴트 선택시 빈 배열 설정
                        }
                      }}
                    />
                  </CRow>
                  <CRow className="d-flex mt-lg-5 h-auto align-items-center">
                    <CRow className="d-flex flex-column w-75">
                      <CCol className="">
                        <p className="text-warning mb-0">&#8251; 탭 메뉴 스타일</p>
                        <p className="w-100" style={{ fontSize: '15px' }}>
                          변경하실 탭메뉴를 선택하시고, 변경등록버튼을 클릭해주세요.
                        </p>
                      </CCol>
                    </CRow>
                    <CRow style={{ width: '120px', height: '50px', verticalAlign: 'middle' }}>
                      <CButton
                        color="info"
                        onClick={addTabList}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <CIcon
                          icon={cilPlus}
                          size="lg"
                          style={{ marginRight: '3px', verticalAlign: 'middle' }}
                        />
                        탭 추가
                      </CButton>
                    </CRow>
                  </CRow>

                  {tabList?.map((input, index) => (
                    <div key={input.id} className="d-flex">
                      <CRow className="border-bottom pt-2 pb-2 align-items-center">
                        <CRow style={{ width: '85%' }}>
                          <CRow className="d-flex flex-md-row flex-column">
                            <CFormLabel
                              htmlFor={`label-${input.id}`}
                              className="col-sm-3 col-form-label"
                            >
                              탭 이름
                            </CFormLabel>
                            <CCol sm={3}>
                              <CFormInput
                                type="text"
                                id={`label-${input.id}`}
                                value={input.label}
                                onChange={(e) => {
                                  const newValue = e.target.value
                                  setTabList((prevTabList) =>
                                    prevTabList.map((item) =>
                                      item.id === input.id ? { ...item, label: newValue } : item,
                                    ),
                                  )
                                }}
                                onBlur={(e) => handleBlur('label', input.id, e.target.value)}
                              />
                            </CCol>
                          </CRow>
                          <CRow className="d-flex flex-md-row flex-column mt-2">
                            <CFormLabel className="col-sm-3 col-form-label">탭이미지</CFormLabel>
                            <CCol
                              md={6}
                              className="d-flex flex-wrap flex-md-row flex-column align-items-start"
                            >
                              <CFormInput
                                type="text"
                                id={`tabImageUrl-${input.id}`}
                                {...register(`tabImageUrl-${input.id}`, {
                                  required: '탭 이미지를 업로드해주세요.',
                                })}
                                placeholder="선택된 파일 없음"
                                readOnly
                                className="me-2"
                              />
                              <CFormInput
                                type="file"
                                id={`tabImage-${input.id}`}
                                data-index={input.id}
                                onChange={imageUpload}
                                ref={(el) => (tabImageUrlInputRef.current[input.id] = el)}
                                style={{ display: 'none' }}
                              />
                            </CCol>
                            <CCol md={3}>
                              <CButton
                                type="button"
                                onClick={() => tabImageUrlInputRef.current[input.id]?.click()}
                                color="primary"
                              >
                                파일 선택
                              </CButton>
                            </CCol>
                          </CRow>
                          <CRow className="d-flex flex-md-row flex-column mt-2">
                            <CFormLabel
                              htmlFor={`url-${input.id}`}
                              className="col-sm-3 col-form-label"
                            >
                              랜딩 URL
                            </CFormLabel>
                            <CCol sm={6} className="flex-grow-1">
                              <CFormInput
                                type="text"
                                id={`url-${input.id}`}
                                placeholder="https://"
                                value={input.landingUrl}
                                onChange={(e) => {
                                  const newValue = e.target.value
                                  setTabList((prevTabList) =>
                                    prevTabList.map((item) =>
                                      item.id === input.id
                                        ? { ...item, landingUrl: newValue }
                                        : item,
                                    ),
                                  )
                                }}
                                onBlur={(e) => handleBlur('landingUrl', input.id, e.target.value)}
                              />
                            </CCol>
                          </CRow>
                        </CRow>
                        <CRow className="ms-2" style={{ width: '15%' }}>
                          <CButton color="danger" onClick={() => removeTabList(input.id)}>
                            삭제
                          </CButton>
                        </CRow>
                      </CRow>
                    </div>
                  ))}
                </CContainer>
              </CInputGroup>
            </CForm>
          </CCol>
        </CRow>
      </CCardBody>
      <CCardFooter className="text-end">
        <CButton type="submit" form="introForm" color="primary">
          {tabListData ? '수정' : '저장'}
        </CButton>
      </CCardFooter>
    </CCard>
  )
}

export default Footer
