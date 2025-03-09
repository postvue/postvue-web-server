import BottomNavBar from 'components/BottomNavBar';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import React from 'react';
import styled from 'styled-components';

const TestPage: React.FC = () => {
  return (
    <>
      <AppBaseTemplate isAppContainerTopMargin={false}>
        <BottomNavBar />
      </AppBaseTemplate>
    </>
  );
};

const TabsWrapper = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 2px solid #ccc;
`;

const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 10px;
  cursor: pointer;
  background: ${(props) => (props.active ? '#007bff' : 'transparent')};
  color: ${(props) => (props.active ? '#fff' : '#000')};
  border: none;
  border-bottom: ${(props) => (props.active ? '2px solid #007bff' : 'none')};
  font-weight: bold;
  outline: none;
`;

const styles = {
  slide: {
    padding: 15,
    minHeight: 100,
    color: '#fff',
  },
  slide1: {
    backgroundColor: '#FEA900',
  },
  slide2: {
    backgroundColor: '#B3DC4A',
  },
  slide3: {
    backgroundColor: '#6AC0FF',
  },
};

export default TestPage;
