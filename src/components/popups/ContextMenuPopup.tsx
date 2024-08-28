import React from 'react';
import styled from 'styled-components';
import { ContextMenuLayoutInfoInterface } from '../../global/interface/contextmenu/contextmenulayout';
import { animationStyle } from '../../styles/animations';
import BodyFixScrollElement from '../BodyFixScrollElement';

interface ContextMenuPopupProps {
  contextMenuLayoutInfo: ContextMenuLayoutInfoInterface;
  children: React.ReactNode;
  setIsActive:
    | React.Dispatch<React.SetStateAction<ContextMenuLayoutInfoInterface>>
    | React.Dispatch<React.SetStateAction<ContextMenuLayoutInfoInterface>>;
}

const ContextMenuPopup: React.FC<ContextMenuPopupProps> = ({
  contextMenuLayoutInfo,
  children,
  setIsActive,
}) => {
  return (
    <>
      <BodyFixScrollElement />
      <ContextMenuContainer
        $positionType={contextMenuLayoutInfo.positionType}
        $positionValue={contextMenuLayoutInfo.positionValue}
      >
        {children}
      </ContextMenuContainer>
      <ScrapBoardNotClickContainer
        onClick={(e) => {
          e.stopPropagation();
          setIsActive((prev) => ({
            ...prev,
            isScrapActive: false,
          }));
        }}
      />
    </>
  );
};

const ContextMenuContainer = styled.div<{
  $positionType: string;
  $positionValue: number;
}>`
  position: absolute;
  width: 198px;
  right: 0px;
  z-index: 1000;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0px 0px 32px 0px rgba(0, 0, 0, 0.2);
  ${(props) => props.$positionType}: ${(props) => props.$positionValue}px;
  right: 0px;
  animation: ${animationStyle.fadeIn} 0.1s ease-in forwards;
`;

const ScrapBoardNotClickContainer = styled.div`
  height: 100%;
  z-index: 500;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  margin: 0px auto;
  cursor: auto;
`;

export default ContextMenuPopup;
