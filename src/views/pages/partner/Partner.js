import React, { useEffect, useState } from 'react'
import { CTable, CButton, CPagination, CPaginationItem } from '@coreui/react'
import user from 'src/api/user'

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
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const fetchData = async (currentPage) => {
    try {
      const { data } = await user.findAll({ pageSize, page: currentPage })

      setItems(
        data.items.map((item, index) => ({
          details: (
            <CButton color="light" size="sm">
              이동
            </CButton>
          ),
          sno: (currentPage - 1) * pageSize + index + 1,
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
    fetchData(page)
  }, [page])

  return (
    <div>
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
    </div>
  )
}
export default Partner
