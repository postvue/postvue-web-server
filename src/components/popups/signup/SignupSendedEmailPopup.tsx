import BottomNextButton from 'components/common/buttton/BottomNextButton';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import React from 'react';
import styled from 'styled-components';

interface SignupSendedEmailPopupProps {
  onClose: () => void;
}

const SignupSendedEmailPopup: React.FC<SignupSendedEmailPopupProps> = ({
  onClose,
}) => {
  return (
    <>
      <RoundSquareCenterPopupLayout
        onClose={onClose}
        popupWrapStyle={{ height: '230px', width: '300px' }}
      >
        <SendedEmailWrap>
          <SendedEmailTitle>인증 메일이 보내졌습니다.</SendedEmailTitle>
          인증 메일을 보냈습니다.
          <br />
          메일함을 확인해 가입을 완료해주세요.
        </SendedEmailWrap>

        <BottomNextButton
          title="확인"
          actionFunc={onClose}
          isTransparent={true}
        />
      </RoundSquareCenterPopupLayout>
    </>
  );
};

const SendedEmailWrap = styled.div`
  text-align: center;
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey7};
`;

const SendedEmailTitle = styled.div`
  text-align: center;
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  margin-bottom: 5px;
  color: black;
`;

export default SignupSendedEmailPopup;
