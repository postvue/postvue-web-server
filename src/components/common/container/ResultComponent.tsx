import React from 'react';
import styled from 'styled-components';

interface ResultComponentProps {
  title: string;
}

const ResultComponent: React.FC<ResultComponentProps> = ({ title }) => {
  return (
    <ResultWrap>
      <ResultTitle>{title}</ResultTitle>
    </ResultWrap>
  );
};

const ResultWrap = styled.div`
  display: flex;
`;

const ResultTitle = styled.div`
  top: calc(50% - 25px);
  left: 50%;
  position: absolute;
  transform: translate(-50%, 50%);
  font: ${({ theme }) => theme.fontSizes.Body4};
  color: ${({ theme }) => theme.grey.Grey5};
`;

export default ResultComponent;
