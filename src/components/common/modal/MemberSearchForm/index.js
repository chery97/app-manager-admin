import React, { useState } from 'react'
import {
  CFormSelect,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormCheck,
  CCol,
  CRow,
  CContainer,
  CCard,
} from '@coreui/react'

const MemberSearch = ({ onSelect }) => {
  const [searchType, setSearchType] = useState('아이디')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMembers, setSelectedMembers] = useState([])

  // ✅ 가짜 회원 데이터 (API 연동 가능)
  const members = [
    { id: 10648405, name: '강미현', email: 'rkdalgus111@hanmail.net', phone: '01047334366' },
    { id: 10648445, name: '송현정', email: 'sara5975@naver.com', phone: '01099162326' },
    { id: 10648594, name: '전계영', email: 'ygyg501@naver.com', phone: '01025361567' },
  ]

  // ✅ 체크박스 선택 핸들러
  const handleSelectMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id],
    )
  }

  return (
    <div>
      {/* 🔍 검색 필터 */}
      <CContainer className="py-4">
        <div className="d-flex justify-content-between pb-4">
          {/* 검색 폼 컨테이너 */}
          <div className="w-75">
            {/* 검색어 필드 */}
            <div className="d-flex align-items-center mb-3">
              <label style={{ width: '20%' }}>검색어</label>
              <div className="d-flex flex-grow-1">
                <CFormSelect
                  className="me-2"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  style={{ width: '41%' }}
                >
                  <option value="아이디">아이디</option>
                  <option value="이름">이름</option>
                  <option value="이메일">이메일</option>
                </CFormSelect>
                <CFormInput
                  className="flex-grow-1"
                  placeholder="검색어 입력"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* 회원등급 필드 */}
            <div className="d-flex align-items-center">
              <label style={{ width: '20%' }}>회원등급</label>
              <CFormSelect
                className="w-25 me-2"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="아이디">아이디</option>
                <option value="이름">이름</option>
                <option value="이메일">이메일</option>
              </CFormSelect>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="d-flex border-start gap-5">
            <div className="d-flex flex-column ms-3">
              <CButton color="danger" className="mb-2">
                검색
              </CButton>
              <CButton color="secondary">초기화</CButton>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <span className="pe-1" style={{ borderRight: '1px solid #98a2b3' }}>
              총 <span className="text-danger">0</span>건
            </span>
            <span className="ps-1">
              회원 <span className="text-danger">0</span>명 선택
            </span>
          </div>
          <CFormSelect
            className="w-25"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="아이디">10개보기</option>
            <option value="아이디">30개보기</option>
            <option value="아이디">50개보기</option>
            <option value="아이디">100개보기</option>
            <option value="아이디">200개보기</option>
          </CFormSelect>
        </div>
      </CContainer>

      {/* 🔥 회원 리스트 테이블 */}
      <CCard className="overflow-hidden">
        <CTable className="mb-0">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>선택</CTableHeaderCell>
              <CTableHeaderCell>회원번호</CTableHeaderCell>
              <CTableHeaderCell>이름</CTableHeaderCell>
              <CTableHeaderCell>이메일</CTableHeaderCell>
              <CTableHeaderCell>휴대폰번호</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {members.map((member) => (
              <CTableRow className="" key={member.id}>
                <CTableDataCell>
                  <CFormCheck
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => handleSelectMember(member.id)}
                  />
                </CTableDataCell>
                <CTableDataCell>{member.id}</CTableDataCell>
                <CTableDataCell>{member.name}</CTableDataCell>
                <CTableDataCell>{member.email}</CTableDataCell>
                <CTableDataCell>{member.phone}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCard>

      {/* ⏩ 페이지네이션 */}
      <div className="d-flex justify-content-between mt-3">
        <CButton disabled color="light">
          ← 이전
        </CButton>
        <span>1 / 4746</span>
        <CButton color="light">다음 →</CButton>
      </div>

      {/* 선택 완료 버튼 */}
      <div className="d-flex justify-content-end mt-3">
        <CButton color="danger" onClick={() => onSelect(selectedMembers)}>
          선택 완료
        </CButton>
      </div>
    </div>
  )
}

export default MemberSearch
