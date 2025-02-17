import React, {useEffect, useState} from 'react'
import { CTable, CButton } from '@coreui/react'
import user from 'src/api/user'
import login from "src/api/login";

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
  const [items, setItems] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await user.findAll({ pageSize: 10, page: 1 })

        setItems(
          data.items.map((item, index) => ({
            details: (
              <CButton color="light" size="sm">
                이동
              </CButton>
            ),
            sno: index + 1,
            userType: item.userType,
            id: item.id,
            userName: item.userName,
            userTel: item.userTel,
            userEmail: item.userEmail,
          })),
        )
      } catch (error) {
        console.error('데이터 가져오기 실패:', error)
      }
    }

    fetchData()
  }, [])

  return <CTable striped columns={columns} items={items} />
}
export default Partner
