import React from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';

interface ResultComponentProps {
  title: string;
  ResultTitleStyle?: React.CSSProperties;
}

const ResultComponent: React.FC<ResultComponentProps> = ({
  title,
  ResultTitleStyle,
}) => {
  return (
    <ResultWrap>
      <ResultTitle style={ResultTitleStyle}>{title}</ResultTitle>
    </ResultWrap>
  );
};

const ResultWrap = styled.div`
  display: flex;
`;

const ResultTitle = styled.div`
  top: calc(50% - ${theme.systemSize.header.height});
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  font: ${({ theme }) => theme.fontSizes.Body4};
  color: ${({ theme }) => theme.grey.Grey5};
`;

export default ResultComponent;
