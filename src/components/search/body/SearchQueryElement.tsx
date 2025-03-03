import { ReactComponent as SearchIcon } from 'assets/images/icon/svg/search/SearchIcon.svg';
import React from 'react';
import styled from 'styled-components';
import { hoverComponentStyle } from 'styles/commonStyles';

interface SearchQueryElementProps {
  children?: React.ReactNode;
  onClickSearchQueryItem: () => void;
  searchQueryWord: string;
  SearchWordContainerStyle?: React.CSSProperties;
  SearchWordStyle?: React.CSSProperties;
}

const SearchQueryElement: React.FC<SearchQueryElementProps> = ({
  children,
  onClickSearchQueryItem,
  searchQueryWord,
  SearchWordContainerStyle,
  SearchWordStyle,
}) => {
  return (
    <SearchWordQueryItemWrap style={SearchWordContainerStyle}>
      <RecenSearchWordItemDeletedWrap>
        <SearchQueryItemWrap
          onClick={(e) => {
            onClickSearchQueryItem();
          }}
        >
          <SearchQueryItem>
            <SearchIcon />
          </SearchQueryItem>
          <SearchWordQueryItem style={SearchWordStyle}>
            {searchQueryWord}
          </SearchWordQueryItem>
        </SearchQueryItemWrap>
        {children}
      </RecenSearchWordItemDeletedWrap>
    </SearchWordQueryItemWrap>
  );
};

const SearchQueryItemWrap = styled.div`
  display: flex;
  gap: 6px;
  cursor: pointer;
  width: calc(100% - 30px);
`;

const SearchQueryItem = styled.div`
  display: flex;
  margin: auto 0;
`;

const SearchWordQueryItemWrap = styled.div`
  background: #fff;
  padding: 10px 0;

  ${hoverComponentStyle}
`;

const RecenSearchWordItemDeletedWrap = styled.div`
  display: flex;
  gap: 4px;
  justify-content: space-between;
`;

const SearchWordQueryItem = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  font-size: 18px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
`;

export default SearchQueryElement;
