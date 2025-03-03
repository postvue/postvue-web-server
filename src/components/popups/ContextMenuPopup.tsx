import useBodyAdaptProps from 'hook/customhook/useBodyAdaptProps';
import useOutsideClick from 'hook/customhook/useOutsideClick';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { BOTTOM_ATTRIBUTE, TOP_ATTRIBUTE } from '../../const/AttributeConst';
import { ContextMenuLayoutInfoInterface } from '../../global/interface/contextmenu/contextmenulayout';
import { animationStyle } from '../../styles/animations';

interface ContextMenuPopupProps {
  children: React.ReactNode;
  onClose: () => void;
  contextMenuRef: HTMLDivElement;
  hasFixedActive?: boolean;
  ContextMenuPopupContainerStyle?: React.CSSProperties;
  contextWidthSize?: number;
}

const ContextMenuPopup: React.FC<ContextMenuPopupProps> = ({
  children,
  contextMenuRef,
  onClose,
  hasFixedActive = true,
  ContextMenuPopupContainerStyle,
  contextWidthSize = 200,
}) => {
  const contextMenuContainerRef = useRef<HTMLDivElement>(null);
  const [contextMenuLayoutInfo, setContextMenuLayoutInfo] =
    useState<ContextMenuLayoutInfoInterface>({
      positionType: TOP_ATTRIBUTE,
      positionValue: 0,
    });

  useEffect(() => {
    if (contextMenuRef) {
      const dom = contextMenuRef.getBoundingClientRect();

      const clipY = dom.y;
      const clipHeight = dom.height;
      const windowHeight = window.innerHeight;

      if (clipY + clipHeight / 2 > windowHeight / 2) {
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

      setTimeout(() => {
        if (!contextMenuContainerRef.current) return;
        contextMenuContainerRef.current.style.display = 'block';
      }, 50);
    }
  }, []);

  if (hasFixedActive) {
    useBodyAdaptProps([
      { key: 'overflow', value: 'hidden' },
      { key: 'touch-action', value: 'none' },
      { key: 'overscroll-behavior', value: 'none' },
    ]);
  }

  useOutsideClick([contextMenuContainerRef], () => {
    onClose();
  });

  return (
    <>
      <ContextMenuContainer
        ref={contextMenuContainerRef}
        $contextWidthSize={contextWidthSize}
        $positionType={contextMenuLayoutInfo.positionType}
        $positionValue={contextMenuLayoutInfo.positionValue}
        style={ContextMenuPopupContainerStyle}
      >
        {children}
      </ContextMenuContainer>
      <ScrapBoardNotClickContainer
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
    </>
  );
};

const POSTION_MARGIN_GAP = 10;

const ContextMenuContainer = styled.div<{
  $positionType: string;
  $positionValue: number;
  $contextWidthSize: number;
}>`
  display: none;
  position: absolute;
  width: ${(props) => props.$contextWidthSize}px;
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
