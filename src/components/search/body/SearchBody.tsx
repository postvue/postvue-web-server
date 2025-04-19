import React, { useState } from 'react';
import styled from 'styled-components';
import theme from '../../../styles/theme';
import SearchBodyEditComponent from './SearchBodyEditComponent';
import SearchBodyRecommComponent from './SearchBodyRecommComponent';

interface SearchBodyProps {
  SearchBodyStyle?: React.CSSProperties;
  isDisplayFavoriteTerm?: boolean;
}

const SearchBody: React.FC<SearchBodyProps> = ({
  SearchBodyStyle,
  isDisplayFavoriteTerm = true,
}) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  return (
    <SearchBodyContainer style={SearchBodyStyle}>
      <SearchBodyEditComponent
        size={size}
        isDisplayFavoriteTerm={isDisplayFavoriteTerm}
      />
      <SearchBodyRecommComponent
        size={size}
        onSetSize={(size) => setSize(size)}
      />
    </SearchBodyContainer>
  );
};

const SearchBodyContainer = styled.div`
  height: 100%;
  min-height: calc(100dvh - ${theme.systemSize.header.heightNumber + 10}px);
`;

export default SearchBody;
