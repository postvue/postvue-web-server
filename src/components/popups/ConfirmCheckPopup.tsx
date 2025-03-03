import { OVERFLOW_DEFAULT, OVERFLOW_HIDDEN } from 'const/AttributeConst';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { animationStyle } from '../../styles/animations';

interface ConfirmCheckPopupLayoutProps {
  confirmPopupTitle?: string;
  confirmPopupSubTitle?: string;
  onClose: () => void;
  hasTransparentOverLay?: boolean;
  hasFixedActive?: boolean;
  popupOverLayContainerStyle?: React.CSSProperties;
  popupContainerStyle?: React.CSSProperties;
  popupWrapStyle?: React.CSSProperties;
  popupContentWrapStyle?: React.CSSProperties;
}

const ConfirmCheckPopup: React.FC<ConfirmCheckPopupLayoutProps> = ({
  confirmPopupTitle,
  confirmPopupSubTitle,
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
    <ConfirmCheckPopupLayoutOverlay
      onClick={() => onClose()}
      style={popupOverLayContainerStyle}
      $hasTransparentOverLay={hasTransparentOverLay}
    >
      <ConfirmCheckPopupContainer style={popupContainerStyle}>
        <ConfirmCheckPopupWrap
          style={popupWrapStyle}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ConfirmCheckPopupContentWrap style={popupContentWrapStyle}>
            <ConfirmCheckPopupTitleWrap>
              <ConfirmCheckPopupTitle>
                {confirmPopupTitle}
              </ConfirmCheckPopupTitle>
              <ConfirmCheckPopupSubTitle>
                {confirmPopupSubTitle}
              </ConfirmCheckPopupSubTitle>
            </ConfirmCheckPopupTitleWrap>
            <ConfirmCheckPopupSelectButtonWrap>
              <ConfirmCheckPopupSelectConfirmButton onClick={onClose}>
                <ConfirmCheckPopupSelectTitle>
                  완료
                </ConfirmCheckPopupSelectTitle>
              </ConfirmCheckPopupSelectConfirmButton>
            </ConfirmCheckPopupSelectButtonWrap>
          </ConfirmCheckPopupContentWrap>
        </ConfirmCheckPopupWrap>
      </ConfirmCheckPopupContainer>
    </ConfirmCheckPopupLayoutOverlay>
  );
};

const ConfirmCheckPopupLayoutOverlay = styled.div<{
  $hasTransparentOverLay: boolean;
}>`
  position: fixed;
  z-index: 2000;
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

const ConfirmCheckPopupContainer = styled.div`
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

const ConfirmCheckPopupWrap = styled.div`
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

const ConfirmCheckPopupContentWrap = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
`;

const ConfirmCheckPopupTitleWrap = styled.div`
  text-align: center;
  height: 100%;
`;
const ConfirmCheckPopupTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  padding-top: 24px;
  padding-bottom: 8px;
`;

const ConfirmCheckPopupSubTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey6};

  padding: 0 24px;
  padding-bottom: 20px;
  white-space: pre-line;
`;

const ConfirmCheckPopupSelectButtonWrap = styled.div`
  display: flex;
  height: 76px;
  border-top: 1px solid ${({ theme }) => theme.grey.Grey3};
`;

const ConfirmCheckPopupSelectCancelButton = styled.div`
  width: 100%;
  text-align: center;
  font: ${({ theme }) => theme.fontSizes.Headline1};
  display: flex;
  cursor: pointer;
`;

const ConfirmCheckPopupSelectConfirmButton = styled(
  ConfirmCheckPopupSelectCancelButton,
)``;

const ConfirmCheckPopupSelectTitle = styled.div`
  margin: auto;
`;

export default ConfirmCheckPopup;
