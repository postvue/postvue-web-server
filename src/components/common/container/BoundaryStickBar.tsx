import React from 'react';
import styled from 'styled-components';

const BoundaryStickBar: React.FC = () => {
  return <BoundaryStickBarContainer />;
};

export default BoundaryStickBar;

const BoundaryStickBarContainer = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.grey.Grey2};
`;
