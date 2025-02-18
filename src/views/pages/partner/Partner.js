import React, { useEffect, useState } from 'react'
import {
  CTable,
  CButton,
  CPagination,
  CPaginationItem,
  CInputGroup,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import user from 'src/api/user'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const Partner = () => {
  const columns = [
    {
      key: 'details',
      label: '상세보기',
      _props: { scope: 'col' },
    },
    {
      key: 'sno',
      label: '번호',
      _props: { scope: 'col' },
    },
    {
      key: 'userType',
      label: '관리자 타입',
      _props: { scope: 'col' },
    },
    {
      key: 'id',
      label: '아이디',
      _props: { scope: 'col' },
    },
    {
      key: 'userName',
      label: '이름',
      _props: { scope: 'col' },
    },
    {
      key: 'userTel',
      label: '전화번호',
      _props: { scope: 'col' },
    },
    {
      key: 'userEmail',
      label: '이메일',
      _props: { scope: 'col' },
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
          details: (
            <CButton color="light" size="sm" href={`#/partner/${item.sno}`}>
              이동
            </CButton>
          ),
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
    <>
      <CInputGroup>
        <CFormSelect
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
          placeholder="검색어를 입력해주세요."
          aria-label="Text input with 2 dropdown buttons"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <CButton
          type="button"
          color="secondary"
          variant="outline"
          id="button-addon2"
          onClick={handleSearch}
        >
          <CIcon icon={cilSearch} />
        </CButton>
      </CInputGroup>
      <CTable striped columns={columns} items={items} />
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
    </>
  )
}
export default Partner
