import React from 'react';
import styled from 'styled-components';

interface SearchQueryElementProps {
  children?: React.ReactNode;
  onClickSearchQueryItem: () => void;
  searchQueryWord: string;
}

const SearchQueryElement: React.FC<SearchQueryElementProps> = ({
  children,
  onClickSearchQueryItem,
  searchQueryWord,
}) => {
  return (
    <RecentSearchWordItemWrap>
      <RecenSearchWordItemDeletedWrap>
        <SearchQueryItemWrap onClick={onClickSearchQueryItem}>
          <SearchQueryItemIcon
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.7498 15.7498L12.4873 12.4873"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </SearchQueryItemIcon>
          <RecentSearchWordItem>{searchQueryWord}</RecentSearchWordItem>
        </SearchQueryItemWrap>
        {children}
      </RecenSearchWordItemDeletedWrap>
    </RecentSearchWordItemWrap>
  );
};

const SearchQueryItemWrap = styled.div`
  display: flex;
  gap: 6px;
  cursor: pointer;
  width: 100%;
`;

const SearchQueryItemIcon = styled.svg`
  margin: auto 0;
`;

const RecentSearchWordItemWrap = styled.div`
  border-radius: 14px;
  background: #fff;
`;

const RecenSearchWordItemDeletedWrap = styled.div`
  display: flex;
  gap: 4px;
  justify-content: space-between;
`;

const RecentSearchWordItem = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body5};
`;

export default SearchQueryElement;
