import { cilContrast, cilMenu, cilMoon, cilSun } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  useColorModes,
} from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { AppHeaderDropdown } from './header/index'
import { AppBreadcrumb } from './index'
import authRequest from 'src/api/core'
import login from 'src/api/login'
import user from 'src/api/user'

const AppHeader = () => {
  const navigate = useNavigate()
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [userId, setUserId] = useState('')
  const [userType, setUserType] = useState('')

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await user.getSummary()
        setUserId(data.id)
        setUserType(data.userType === 'admin' ? '관리자' : '파트너')
      } catch (error) {
        console.error('error', error)
      }
    }
    fetchData()
  }, [])

  const goLogout = async () => {
    try {
      await login.signOut()
      localStorage.removeItem('GEEK_SSID')
      navigate('/login', { replace: true })
    } catch (error) {
      alert('로그아웃이 정상적으로 되지 않았습니다. 고객센터에 문의해주세요')
      console.log(error)
    }
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex"></CHeaderNav>
        <CHeaderNav className="ms-auto" />
        <CHeaderNav className="d-flex align-items-center gap-3">
          <span className="text-body-secondary">
            {userId} ({userType})
          </span>
          <CDropdown
            variant="nav-item"
            placement="bottom-end"
            className="d-flex align-items-center"
          >
            <CDropdownToggle className="p-0" caret={false} style={{ lineHeight: 0 }}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <AppHeaderDropdown />
          <CButton
            className="p-0"
            variant="ghost"
            style={{
              border: 'none',
            }}
            onClick={goLogout}
          >
            <span>로그아웃</span>
          </CButton>
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
