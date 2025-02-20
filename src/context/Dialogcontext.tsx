import React, { createContext, useContext, useState } from 'react'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react'
import modal from '@/components/common/modal'

// confirm 파라미터 타입
type ConfirmOptions = {
  title?: string
  message: string | React.ReactNode // JSX 요소도 받을 수 있도록 변경
  buttons: { label: string; value: any; color?: string }[]
  size?: 'small' | 'large'
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
  const [isVisible, setIsVisible] = useState(false) // 애니메이션을 위한 상태 추가

  const confirm = (options: ConfirmOptions): Promise<any> => {
    return new Promise((resolve) => {
      setModalData(options)
      setResolveFn(() => resolve)
      setIsVisible(true) // 모달 열기 (애니메이션 적용)
    })
  }

  const handleAction = (result: any) => {
    setIsVisible(false) // `visible`을 false로 변경하여 애니메이션 적용
    setTimeout(() => {
      if (resolveFn) resolveFn(result)
      setModalData(null) // 애니메이션 후 모달 데이터 초기화
    }, 300) // CoreUI 기본 애니메이션 시간 (0.3s)
  }

  return (
    <DialogContext.Provider value={{ confirm }}>
      {children}

      {/* CoreUI 모달 적용 */}
      <CModal
        visible={!!modalData}
        onClose={() => handleAction(null)}
        backdrop={true} // ✅ 바깥 클릭하면 닫히도록 설정
        alignment="center"
        className={`custom-modal-size ${modalData?.size === 'large' ? 'large' : 'small'}`}
      >
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
