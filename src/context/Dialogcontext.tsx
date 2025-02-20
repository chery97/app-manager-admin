import React, { createContext, useContext, useState } from 'react'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react'

// confirm 파라미터 타입
type ConfirmOptions = {
  title?: string
  message: string
  buttons: { label: string; value: any; color?: string }[]
}

// DialogContext 타입 정의
type DialogContextType = {
  confirm: (options: ConfirmOptions) => Promise<any>
}

// Context 기본값 설정
const DialogContext = createContext<DialogContextType>({
  confirm: () => new Promise((_, reject) => reject()),
})

// DialogProvider 구현
export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalData, setModalData] = useState<ConfirmOptions | null>(null)
  const [resolveFn, setResolveFn] = useState<((value: any) => void) | null>(null)

  const confirm = (options: ConfirmOptions): Promise<any> => {
    return new Promise((resolve) => {
      setModalData(options)
      setResolveFn(() => resolve)
    })
  }

  const handleAction = (result: any) => {
    if (resolveFn) resolveFn(result)
    setModalData(null)
  }

  return (
    <DialogContext.Provider value={{ confirm }}>
      {children}

      {/* CoreUI 모달 적용 */}
      <CModal visible={!!modalData} onClose={() => handleAction(null)}>
        {modalData && (
          <>
            <CModalHeader>
              <CModalTitle>{modalData.title || '알림'}</CModalTitle>
            </CModalHeader>
            <CModalBody>{modalData.message}</CModalBody>
            <CModalFooter>
              {modalData.buttons.map((btn, index) => (
                <CButton
                  key={index}
                  color={btn.color || 'primary'}
                  onClick={() => handleAction(btn.value)}
                >
                  {btn.label}
                </CButton>
              ))}
            </CModalFooter>
          </>
        )}
      </CModal>
    </DialogContext.Provider>
  )
}

// useDialog 커스텀 훅 생성
export const useDialog = () => useContext(DialogContext)
