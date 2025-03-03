import { OVERFLOW_DEFAULT, OVERFLOW_HIDDEN } from 'const/AttributeConst';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { animationStyle } from '../../styles/animations';

interface ConfirmPopupLayoutProps {
  confirmPopupTitle?: string;
  confirmPopupSubTitle?: string;
  isActive?: boolean;
  actionFunc?: () => void;
  onClose: () => void;
  hasTransparentOverLay?: boolean;
  hasFixedActive?: boolean;
  popupOverLayContainerStyle?: React.CSSProperties;
  popupContainerStyle?: React.CSSProperties;
  popupWrapStyle?: React.CSSProperties;
  popupContentWrapStyle?: React.CSSProperties;
}

const ConfirmPopup: React.FC<ConfirmPopupLayoutProps> = ({
  confirmPopupTitle,
  confirmPopupSubTitle,
  popupOverLayContainerStyle,
  popupContainerStyle,
  popupContentWrapStyle,
  popupWrapStyle,
  isActive = true,
  actionFunc,
  onClose,
  hasTransparentOverLay = false,
  hasFixedActive = true,
}) => {
  const onClickConfirm = () => {
    if (isActive && actionFunc) {
      actionFunc();
    }
  };

  useEffect(() => {
    if (!hasFixedActive) return;
    document.body.style.overflow = OVERFLOW_HIDDEN;

    return () => {
      document.body.style.overflow = OVERFLOW_DEFAULT;
    };
  }, []);

  return (
    <ConfirmPopupLayoutOverlay
      onClick={onClose}
      style={popupOverLayContainerStyle}
      $hasTransparentOverLay={hasTransparentOverLay}
    >
      <ConfirmPopupContainer style={popupContainerStyle}>
        <ConfirmPopupWrap
          style={popupWrapStyle}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ConfirmPopupContentWrap style={popupContentWrapStyle}>
            <ConfirmPopupTitleWrap>
              <ConfirmPopupTitle>{confirmPopupTitle}</ConfirmPopupTitle>
              <ConfirmPopupSubTitle>
                {confirmPopupSubTitle}
              </ConfirmPopupSubTitle>
            </ConfirmPopupTitleWrap>
            <ConfirmPopupSelectButtonWrap>
              <ConfirmPopupSelectCancelButton onClick={onClose}>
                <ConfirmPopupSelectTitle>취소</ConfirmPopupSelectTitle>
              </ConfirmPopupSelectCancelButton>
              <ConfirmPopupSelectConfirmButton onClick={onClickConfirm}>
                <ConfirmPopupSelectTitle>확인</ConfirmPopupSelectTitle>
              </ConfirmPopupSelectConfirmButton>
            </ConfirmPopupSelectButtonWrap>
          </ConfirmPopupContentWrap>
        </ConfirmPopupWrap>
      </ConfirmPopupContainer>
    </ConfirmPopupLayoutOverlay>
  );
};

const ConfirmPopupLayoutOverlay = styled.div<{
  $hasTransparentOverLay: boolean;
}>`
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: rgba(0, 0, 0, 0.5);
  ${(props) => props.$hasTransparentOverLay && 'background: rgba(0,0,0,0)'};
`;

const ConfirmPopupContainer = styled.div`
  z-index: 500;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease-out;
`;

const ConfirmPopupWrap = styled.div`
  bottom: 0;
  z-index: 1000;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  display: flex;
  width: 278px;
  height: 182px;
  background: white;
  border-radius: 16px;
  animation: ${animationStyle.fadeIn} 0.2s ease-in-out;
`;

const ConfirmPopupContentWrap = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
`;

const ConfirmPopupTitleWrap = styled.div`
  text-align: center;
  height: 100%;
`;
const ConfirmPopupTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  padding-top: 24px;
  padding-bottom: 8px;
`;

const ConfirmPopupSubTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey6};

  padding: 0 24px;
  padding-bottom: 20px;
  white-space: pre-line;
`;

const ConfirmPopupSelectButtonWrap = styled.div`
  display: flex;
  height: 76px;
  border-top: 1px solid ${({ theme }) => theme.grey.Grey3};
`;

const ConfirmPopupSelectCancelButton = styled.div`
  width: 100%;
  text-align: center;
  font: ${({ theme }) => theme.fontSizes.Headline1};
  display: flex;
  cursor: pointer;
`;

const ConfirmPopupSelectConfirmButton = styled(ConfirmPopupSelectCancelButton)`
  border-left: 1px solid ${({ theme }) => theme.grey.Grey3};
`;

const ConfirmPopupSelectTitle = styled.div`
  margin: auto;
`;

export default ConfirmPopup;
