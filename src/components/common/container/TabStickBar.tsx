import React from 'react';
import styled from 'styled-components';

const TabStickBar: React.FC = () => {
  return <TabStickBarComponent />;
};

const TabStickBarComponent = styled.div`
  background-color: ${({ theme }) => theme.mainColor.Black};
  height: 2.5px;
  border-radius: 5px;
  margin-top: 1px;
`;

export default TabStickBar;
