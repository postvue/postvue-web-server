import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';

interface FloatingActionButtonLayoutProps {
  children: React.ReactNode;
  FloatingActionAreaRef: React.RefObject<HTMLDivElement>;
}

const FloatingActionButtonLayout: React.FC<FloatingActionButtonLayoutProps> = ({
  children,
  FloatingActionAreaRef,
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
        if (FloatingActionAreaRef.current) {
          const scrollTop = FloatingActionAreaRef.current.scrollTop;
          const scrollDifference = scrollTop - prevScrollTopRef.current;

          if (scrollDifference > 50) {
            setScrollOpacity(0);
            prevScrollTopRef.current = scrollTop;
          } else if (scrollDifference < -50) {
            setScrollOpacity(1);
            prevScrollTopRef.current = scrollTop;
          }
        }
      });
    };

    const element = FloatingActionAreaRef.current;
    element?.addEventListener('scroll', handleScroll);

    return () => {
      element?.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <FloatingActionWrap opacity={scrollOpacity}>{children}</FloatingActionWrap>
  );
};

const FloatingActionWrap = styled.div<{ opacity: number }>`
  z-index: 1000;
  position: fixed;
  transform: translate(-50%, 50%);
  left: 50%;

  border-radius: 22px;
  padding: 8px 13px;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.15);

  bottom: calc(${theme.systemSize.bottomNavBar.height} + 56px);

  cursor: pointer;

  background-color: rgba(255, 255, 255, ${(props) => props.opacity});
  transition: background-color 0.3s ease; /* Smooth transition for background-color change */
`;

export default FloatingActionButtonLayout;
