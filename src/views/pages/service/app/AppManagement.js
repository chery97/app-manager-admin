import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CNavLink,
  CPagination,
  CPaginationItem,
  CTable,
} from '@coreui/react'
import { NavLink, useParams } from 'react-router-dom'
import user from 'src/api/user'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const AppManagement = () => {
  const columns = [
    {
      key: 'sno',
      label: '번호',
      _props: { scope: 'col' },
      _style: { width: '6%' },
    },
    {
      key: 'userType',
      label: '관리자 타입',
      _props: { scope: 'col' },
      _style: { width: '10%' },
    },
    {
      key: 'id',
      label: '아이디',
      _props: { scope: 'col' },
      _style: { width: '16%' },
    },
    {
      key: 'userName',
      label: '업체명',
      _props: { scope: 'col' },
      _style: { width: '20%' },
    },
    {
      key: 'userTel',
      label: '전화번호',
      _props: { scope: 'col' },
      _style: { width: '20%' },
    },
    {
      key: 'userEmail',
      label: '이메일',
      _props: { scope: 'col' },
      _style: { width: '20%' },
    },
  ]
  const [items, setItems] = useState([])
  const [searchType, setSearchType] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const fetchData = async (params) => {
    try {
      const queryString = {
        pageSize,
        page: params.page,
        searchType: params.searchType ?? '',
        keyword: params.searchKeyword ?? '',
      }
      const { data } = await user.findAll(queryString)

      setItems(
        data.items.map((item, index) => ({
          sno: (page - 1) * pageSize + index + 1,
          userType: item.userType,
          id: item.id,
          userName: item.userName,
          userTel: item.userTel,
          userEmail: item.userEmail,
        })),
      )
      setTotalPages(data.totalPage)
    } catch (error) {
      console.error('error:', error)
    }
  }

  useEffect(() => {
    const param = {
      page,
      searchType,
      searchKeyword,
    }
    fetchData(param)
  }, [page])

  const handleSearch = () => {
    fetchData({ searchType, searchKeyword }) // 검색 실행
  }

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex align-items-center">
        <strong>애플리케이션 관리</strong>
        <CButton type="button" color="primary" className="ms-auto">
          <CNavLink to="/service/app/register" as={NavLink}>
            애플리케이션 등록
          </CNavLink>
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CInputGroup className="mb-5 mt-3">
          <CFormSelect
            style={{ width: '10%' }}
            aria-label="Default select example"
            options={[
              { label: '선택', value: '', disabled: true },
              { label: 'ID', value: 'id' },
              { label: '업체명', value: 'userName' },
            ]}
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          />
          <CFormInput
            style={{ width: '75%' }}
            placeholder="검색어를 입력해주세요."
            aria-label="Text input with 2 dropdown buttons"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyUp={(e) => {
              if (e.keyCode === 13) handleSearch()
            }}
          />
          <CButton
            type="button"
            color="secondary"
            variant="outline"
            id="button-addon2"
            style={{ width: '5%' }}
            onClick={handleSearch}
          >
            <CIcon icon={cilSearch} />
          </CButton>
        </CInputGroup>
        <CTable className="text-center" striped columns={columns} items={items} />
        <CPagination align="center">
          <CPaginationItem
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            이전
          </CPaginationItem>

          {[...Array(totalPages)].map((_, i) => (
            <CPaginationItem key={i} active={i + 1 === page} onClick={() => setPage(i + 1)}>
              {i + 1}
            </CPaginationItem>
          ))}

          <CPaginationItem
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            다음
          </CPaginationItem>
        </CPagination>
      </CCardBody>
    </CCard>
  )
}
export default AppManagement
