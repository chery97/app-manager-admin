import React from 'react'
import { CTable, CButton } from '@coreui/react'

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
  const items = [
    {
      details: <CButton color="light" size="sm">이동</CButton>,
      sno: 1,
      userType: 'partner',
      id: 'testId',
      userName: 'testName',
      userTel: '010-1234-5678',
      userEmail: 'test@gmail.com',
    },
  ]

  return <CTable striped columns={columns} items={items} />
}
export default Partner
