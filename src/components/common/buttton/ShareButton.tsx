import React from 'react';
import styled from 'styled-components';

const ShareButton: React.FC = () => {
  return (
    <ShareButtonWrap
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <g clipPath="url(#clip0_149_3173)">
        <path
          d="M18.3332 1.6665L9.1665 10.8332"
          stroke="#535B63"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.3332 1.6665L12.4998 18.3332L9.1665 10.8332L1.6665 7.49984L18.3332 1.6665Z"
          stroke="#535B63"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_149_3173">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </ShareButtonWrap>
  );
};

const ShareButtonWrap = styled.svg`
  margin: auto 0;
`;

export default ShareButton;
