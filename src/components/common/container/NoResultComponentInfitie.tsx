import { API_SUCCESS_PHARSE_TEXT } from 'const/SystemPhraseConst';
import React from 'react';
import styled from 'styled-components';

interface NoResultComponentProps {
  NoResultTitleStyle?: React.CSSProperties;
}

const NoResultComponentInfinite: React.FC<NoResultComponentProps> = ({
  NoResultTitleStyle,
}) => {
  return (
    <ResultWrap>
      <ResultTitle style={NoResultTitleStyle}>
        {API_SUCCESS_PHARSE_TEXT}
      </ResultTitle>
    </ResultWrap>
  );
};

const ResultWrap = styled.div`
  display: flex;
  height: 70dvh;
  position: relative;
`;

const ResultTitle = styled.div`
  top: calc(50%);
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  font: ${({ theme }) => theme.fontSizes.Body4};
  color: ${({ theme }) => theme.grey.Grey5};
`;

export default NoResultComponentInfinite;
