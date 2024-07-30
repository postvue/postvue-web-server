import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface AppBaseTemplate {
  children: ReactNode;
}

const AppBaseTemplate: React.FC<AppBaseTemplate> = ({ children }) => {
  return (
    <Container>
      {/* refer: 수정 */}
      {/* <Header>헤더</Header> */}
      <Main id="main">{children}</Main>

      {/* refer: 수정 */}
      {/* <SideBar>사이드바</SideBar> */}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
`;
const Header = styled.div`
  background-color: red;
  width: 240px;
`;
const SideBar = styled.div`
  background-color: yellow;
  width: 100%;
  max-width: 320px;
`;
const Main = styled.div`
  display: block;
  width: 100%;
  max-width: 800px;
`;

export default AppBaseTemplate;
