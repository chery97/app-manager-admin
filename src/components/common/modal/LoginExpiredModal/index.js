import CommonModal from 'src/components/common/modal'

const LoginExpiredModal = ({ isVisible, onClose }) => {
  return (
    <CommonModal
      isVisible={isVisible}
      onClose={onClose}
      title="로그인이 필요합니다"
      body="로그인 상태가 만료되었습니다. 다시 로그인해주세요."
      buttonList={[{ text: '로그인 페이지로 이동', color: 'secondary', onClick: onClose }]}
    />
  )
}

export default LoginExpiredModal
