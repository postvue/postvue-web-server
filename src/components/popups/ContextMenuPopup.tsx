import BodyHiddenScrollElement from 'components/BodyHiddenScrollElement';
import React, { useEffect, useState } from 'react';
import { SetterOrUpdater } from 'recoil';
import styled from 'styled-components';
import { BOTTOM_ATTRIBUTE, TOP_ATTRIBUTE } from '../../const/AttributeConst';
import { ContextMenuLayoutInfoInterface } from '../../global/interface/contextmenu/contextmenulayout';
import { animationStyle } from '../../styles/animations';

interface ContextMenuPopupProps {
  children: React.ReactNode;
  setIsActive:
    | SetterOrUpdater<boolean>
    | React.Dispatch<React.SetStateAction<boolean>>
    | SetterOrUpdater<boolean | number>
    | React.Dispatch<React.SetStateAction<boolean | number>>
    | SetterOrUpdater<boolean | string>
    | React.Dispatch<React.SetStateAction<boolean | string>>
    | SetterOrUpdater<boolean | number | string>
    | React.Dispatch<React.SetStateAction<boolean | number | string>>;
  contextMenuRef: React.RefObject<HTMLElement>;
  hasFixedActive?: boolean;
}

const ContextMenuPopup: React.FC<ContextMenuPopupProps> = ({
  children,
  contextMenuRef,
  setIsActive,
  hasFixedActive = true,
}) => {
  const [contextMenuLayoutInfo, setContextMenuLayoutInfo] =
    useState<ContextMenuLayoutInfoInterface>({
      positionType: TOP_ATTRIBUTE,
      positionValue: 0,
    });

  useEffect(() => {
    if (contextMenuRef.current) {
      const body = document.body;
      const dom = contextMenuRef.current.getBoundingClientRect();

      const clipY = dom.y;
      const clipHeight = dom.height;
      const bodyHeight = body.offsetHeight;

      if (clipY + clipHeight / 2 > bodyHeight / 2) {
        setContextMenuLayoutInfo((prev) => ({
          ...prev,
          positionType: BOTTOM_ATTRIBUTE,
          positionValue: clipHeight + POSTION_MARGIN_GAP,
        }));
      } else {
        setContextMenuLayoutInfo((prev) => ({
          ...prev,
          positionType: TOP_ATTRIBUTE,
          positionValue: clipHeight + POSTION_MARGIN_GAP,
        }));
      }
    }
  }, []);

  return (
    <>
      {hasFixedActive && <BodyHiddenScrollElement />}
      <ContextMenuContainer
        $positionType={contextMenuLayoutInfo.positionType}
        $positionValue={contextMenuLayoutInfo.positionValue}
      >
        {children}
      </ContextMenuContainer>
      <ScrapBoardNotClickContainer
        onClick={(e) => {
          e.stopPropagation();
          setIsActive(false);
        }}
      />
    </>
  );
};

const POSTION_MARGIN_GAP = 10;

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
