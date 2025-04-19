import { keyframes } from 'styled-components';

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(-20%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideLeft = keyframes`
  from {
    transform: translateX(70%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const slideRightToLeft = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const slideLeftToRight = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
`;

export const slideZeroToLeft = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-20%);
     opacity: 0;
  }
`;

export const animationStyle = {
  slideUp,
  slideDown,
  fadeIn,
  slideLeft,
  slideLeftToRight,
  slideRightToLeft,
  slideZeroToLeft,
};
