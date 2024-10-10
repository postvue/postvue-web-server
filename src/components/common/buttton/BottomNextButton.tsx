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
}

const BottomNextButton: React.FC<BottomNextButtonProps> = ({
  bottomNextButtonRef,
  title,
  actionFunc,
  hasNotActiveElement = true,
  isActive = true,
  notActiveTitle,
  isTransparent = false,
}) => {
  return (
    <BottomNextButtonWrapContainer
      $isTransparent={isTransparent}
      ref={bottomNextButtonRef}
    >
      {isActive ? (
        <BottomNextButtonWrap
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
            <BottomNextNotActiveButtonWrap>
              {notActiveTitle}
            </BottomNextNotActiveButtonWrap>
          )}
        </>
      )}
    </BottomNextButtonWrapContainer>
  );
};

const BottomNextButtonWrapContainer = styled.div<{ $isTransparent: boolean }>`
  position: fixed;
  bottom: 0px;
  // left: 0;
  // right: 0px;
  // margin: 0 auto;
  width: 100%;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  text-align: center;
  background-color: ${(props) =>
    props.$isTransparent ? '' : theme.mainColor.White};
`;

const BottomNextButtonWrap = styled.div`
  padding: 14px 0;
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  color: ${({ theme }) => theme.mainColor.White};
  background-color: ${({ theme }) => theme.mainColor.Blue};
  border-radius: 8px;
  margin: 13px 20px
    ${({ theme }) => theme.systemSize.appDisplaySize.bottomButtonMargin} 20px;
  cursor: pointer;
`;

const BottomNextNotActiveButtonWrap = styled(BottomNextButtonWrap)`
  background-color: ${({ theme }) => theme.grey.Grey3};
  opacity: 0.4;
  color: ${({ theme }) => theme.mainColor.Black};
  cursor: auto;
`;

export default BottomNextButton;
