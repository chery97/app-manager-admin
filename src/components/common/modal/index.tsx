import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react'
import React from 'react'

type Colors = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'

const CommonModal = ({
  title,
  body,
  isVisible,
  onClose,
  buttonList = [],
}: {
  title: string
  body: React.ReactNode | string
  isVisible: boolean
  onClose: () => void
  buttonList: {
    text: string
    color: Colors
    onClick: () => void
  }[]
}) => {
  return (
    <CModal visible={isVisible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{body}</CModalBody>
      <CModalFooter>
        {buttonList.map(({ text, color, onClick }, index) => (
          <CButton key={index} color={color} onClick={onClick}>
            {text}
          </CButton>
        ))}
      </CModalFooter>
    </CModal>
  )
}

export default CommonModal
