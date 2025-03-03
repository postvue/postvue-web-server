import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import React from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';

interface BottomNextButtonProps {
  bottomNextButtonRef?: React.RefObject<HTMLDivElement>;
  title: string;
  actionFunc?: (e: React.MouseEvent<HTMLDivElement>) => void;
  hasNotActiveElement?: boolean;
  isActive?: boolean;
  notActiveTitle?: string;
  isTransparent?: boolean;
  BottomNextButtonWrapContainerStyle?: React.CSSProperties;
  backgroundColor?: string;
}

const BottomNextButton: React.FC<BottomNextButtonProps> = ({
  bottomNextButtonRef,
  title,
  actionFunc,
  hasNotActiveElement = true,
  isActive = true,
  notActiveTitle,
  isTransparent = false,
  BottomNextButtonWrapContainerStyle,
  backgroundColor = theme.mainColor.Blue,
}) => {
  return (
    <BottomNextButtonWrapContainer
      $isTransparent={isTransparent}
      ref={bottomNextButtonRef}
      style={BottomNextButtonWrapContainerStyle}
    >
      {isActive ? (
        <BottomNextButtonWrap
          $backgroundColor={backgroundColor}
          onClick={(e) => {
            if (!actionFunc) return;
            actionFunc(e);
          }}
        >
          {title}
        </BottomNextButtonWrap>
      ) : (
        <>
          {hasNotActiveElement && (
            <BottomNextNotActiveButtonWrap $backgroundColor={backgroundColor}>
              {notActiveTitle}
            </BottomNextNotActiveButtonWrap>
          )}
        </>
      )}
    </BottomNextButtonWrapContainer>
  );
};

const BottomNextButtonWrapContainer = styled.div<{ $isTransparent: boolean }>`
  position: absolute;
  bottom: 0px;
  // left: 0;
  // right: 0px;
  // margin: 0 auto;
  width: 100%;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    padding-bottom: 30px;
  }

  text-align: center;
  background-color: ${(props) =>
    props.$isTransparent ? '' : theme.mainColor.White};
`;

const BottomNextButtonWrap = styled.div<{ $backgroundColor: string }>`
  padding: 14px 0;
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  color: ${({ theme }) => theme.mainColor.White};
  background-color: ${(props) => props.$backgroundColor};
  border-radius: 8px;
  margin: 13px 20px calc(10px + env(safe-area-inset-top)) 20px;
  cursor: pointer;
`;

const BottomNextNotActiveButtonWrap = styled(BottomNextButtonWrap)`
  background-color: ${({ theme }) => theme.grey.Grey3};
  opacity: 0.4;
  color: ${({ theme }) => theme.mainColor.Black};
  cursor: auto;
`;

export default BottomNextButton;
