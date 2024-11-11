import { css } from 'styled-components';

export const filterBrigntnessStyle = css`
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      filter: brightness(0.7);
    }
  }
`;

export const hoverRoundCoverStyle = css`
  cursor: pointer;

  &:hover {
    border-radius: 20px;

    // box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); /* 원형 테두리 느낌 */
    background-color: rgba(0, 0, 0, 0.1); /* 어두운 오버레이 */
  }
`;

export const borderShadowStyle_prop = `
rgba(0, 0, 0, 0.1) 0px 1px 20px 0px`;
