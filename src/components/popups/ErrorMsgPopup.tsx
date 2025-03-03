import { OVERFLOW_DEFAULT, OVERFLOW_HIDDEN } from 'const/AttributeConst';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { animationStyle } from '../../styles/animations';

interface ErrorMsgPopupLayoutProps {
  onClose: () => void;
  errorMsgPopupTitle?: string;
  errorMsgPopupSubTitle?: string;
  hasTransparentOverLay?: boolean;
  hasFixedActive?: boolean;
  popupOverLayContainerStyle?: React.CSSProperties;
  popupContainerStyle?: React.CSSProperties;
  popupWrapStyle?: React.CSSProperties;
  popupContentWrapStyle?: React.CSSProperties;
}

const ErrorMsgPopup: React.FC<ErrorMsgPopupLayoutProps> = ({
  errorMsgPopupTitle,
  errorMsgPopupSubTitle,
  popupOverLayContainerStyle,
  popupContainerStyle,
  popupContentWrapStyle,
  popupWrapStyle,
  onClose,
  hasTransparentOverLay = false,
  hasFixedActive = true,
}) => {
  useEffect(() => {
    if (!hasFixedActive) return;
    document.body.style.overflow = OVERFLOW_HIDDEN;

    return () => {
      document.body.style.overflow = OVERFLOW_DEFAULT;
    };
  }, []);

  return (
    <ErrorMsgPopupLayoutOverlay
      onClick={onClose}
      style={popupOverLayContainerStyle}
      $hasTransparentOverLay={hasTransparentOverLay}
    >
      <ErrorMsgPopupContainer style={popupContainerStyle}>
        <ErrorMsgPopupWrap
          style={popupWrapStyle}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ErrorMsgPopupContentWrap style={popupContentWrapStyle}>
            <ErrorMsgPopupTitleWrap>
              <ErrorMsgPopupTitle>{errorMsgPopupTitle}</ErrorMsgPopupTitle>
              <ErrorMsgPopupSubTitle>
                {errorMsgPopupSubTitle}
              </ErrorMsgPopupSubTitle>
            </ErrorMsgPopupTitleWrap>
            <ErrorMsgPopupSelectButtonWrap>
              <ErrorMsgPopupSelectCancelButton onClick={onClose}>
                <ErrorMsgPopupSelectTitle>확인</ErrorMsgPopupSelectTitle>
              </ErrorMsgPopupSelectCancelButton>
            </ErrorMsgPopupSelectButtonWrap>
          </ErrorMsgPopupContentWrap>
        </ErrorMsgPopupWrap>
      </ErrorMsgPopupContainer>
    </ErrorMsgPopupLayoutOverlay>
  );
};

const ErrorMsgPopupLayoutOverlay = styled.div<{
  $hasTransparentOverLay: boolean;
}>`
  position: fixed;
  z-index: 3000;
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

const ErrorMsgPopupContainer = styled.div`
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

const ErrorMsgPopupWrap = styled.div`
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

const ErrorMsgPopupContentWrap = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
`;

const ErrorMsgPopupTitleWrap = styled.div`
  text-align: center;
  height: 100%;
`;
const ErrorMsgPopupTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  padding-top: 24px;
  padding-bottom: 8px;
`;

const ErrorMsgPopupSubTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey6};

  padding: 0 24px;
  padding-bottom: 20px;
  white-space: pre-line;
`;

const ErrorMsgPopupSelectButtonWrap = styled.div`
  display: flex;
  height: 76px;
  border-top: 1px solid ${({ theme }) => theme.grey.Grey3};
`;

const ErrorMsgPopupSelectCancelButton = styled.div`
  width: 100%;
  text-align: center;
  font: ${({ theme }) => theme.fontSizes.Headline1};
  display: flex;
  cursor: pointer;
`;

const ErrorMsgPopupSelectTitle = styled.div`
  margin: auto;
`;

export default ErrorMsgPopup;
