import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';

interface FloatingActionButtonLayoutProps {
  children: React.ReactNode;
  containerRef?: React.RefObject<HTMLDivElement>;
  maxGap?: number;
  isActiveDown?: boolean;
  actionFunc?: () => void;
  bottomGap?: number;
  bottomByMinSize?: number;
  bottomByMaxSize?: number;
  FloatingActionButtonLayoutStyle?: React.CSSProperties;
}

const FloatingActionButtonLayout: React.FC<FloatingActionButtonLayoutProps> = ({
  children,
  containerRef,
  maxGap = 50,
  isActiveDown = true,
  actionFunc,
  bottomByMaxSize = 0,
  bottomByMinSize = theme.systemSize.bottomNavBar.heightNum,
  bottomGap = 0,
  FloatingActionButtonLayoutStyle,
}) => {
  const prevScrollTopRef = useRef(0);
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        let scrollTop: number;

        if (containerRef && containerRef.current) {
          scrollTop = containerRef.current.scrollTop;
        } else {
          scrollTop = window.scrollY;
        }

        const scrollDifference = scrollTop - prevScrollTopRef.current;

        if (scrollDifference > maxGap) {
          if (isActiveDown) {
            setScrollOpacity(0);
          } else {
            setScrollOpacity(1);
          }

          prevScrollTopRef.current = scrollTop;
        } else if (scrollDifference < -maxGap) {
          if (isActiveDown) {
            setScrollOpacity(1);
          } else {
            setScrollOpacity(0);
          }
          prevScrollTopRef.current = scrollTop;
        }
      });
    };

    if (containerRef && containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (containerRef && containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <FloatingActionWrap
      style={FloatingActionButtonLayoutStyle}
      $bottomByMaxSize={bottomByMaxSize}
      $bottomByMinSize={bottomByMinSize}
      $bottomGap={bottomGap}
      opacity={scrollOpacity}
      onClick={() => {
        if (!actionFunc) return;
        actionFunc();
      }}
    >
      {children}
    </FloatingActionWrap>
  );
};

const FloatingActionWrap = styled.div<{
  opacity: number;
  $bottomByMinSize: number;
  $bottomByMaxSize: number;
  $bottomGap: number;
}>`
  z-index: 1000;
  position: fixed;
  transform: translate(-50%, 50%);
  left: 50%;

  border-radius: 22px;
  padding: 8px 13px;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.15);

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    bottom: calc(
      ${(props) => props.$bottomByMinSize}px + ${(props) => props.$bottomGap}px
    );
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    bottom: calc(
      ${(props) => props.$bottomByMaxSize}px + ${(props) => props.$bottomGap}px
    );
  }

  cursor: pointer;

  background-color: rgba(255, 255, 255, ${(props) => props.opacity});
  transition: background-color 0.2s ease;
`;

export default FloatingActionButtonLayout;
