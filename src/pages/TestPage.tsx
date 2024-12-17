import React, { useState } from 'react';
import styled from 'styled-components';

const TestPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleTabClick = (index: number) => {
    setCurrentIndex(index);
  };

  const list = [0, 1, 2];
  return (
    <>
      {/* <TabsWrapper>
        {list.map((label, index) => (
          <TabButton
            key={label}
            active={currentIndex === index}
            onClick={() => handleTabClick(index)}
          >
            {label}
          </TabButton>
        ))}
      </TabsWrapper>
      <ViewPagerLayout tabId={currentIndex} setTabId={setCurrentIndex}>
        <div style={Object.assign({}, styles.slide, styles.slide1)}>
          slide n°1slide
        </div>
        <div style={Object.assign({}, styles.slide, styles.slide2)}>
          slide n°2
        </div>
        <div style={Object.assign({}, styles.slide, styles.slide3)}>
          slide n°3
        </div>
      </ViewPagerLayout> */}
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
