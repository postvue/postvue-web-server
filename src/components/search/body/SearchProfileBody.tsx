import React from 'react';

import styled from 'styled-components';

import SnsPostMasonryLayout from 'components/layouts/SnsPostMasonryLayout';
import { QueryStatePostSearchListInfinite } from 'hook/queryhook/QueryStatePostSearchListInfinite';
import SearchPostListInfiniteScroll from 'hook/SearchPostListInfiniteScroll';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  isActiveSearchPostFilterPopupAtom,
  searchQueryAndFilterKeyAtom,
  searchWordAtom,
} from 'states/SearchPostAtom';

import { ReactComponent as PostSearchFilterButtonIcon } from 'assets/images/icon/svg/post/PostSearchFilterButtonIcon.svg';

const SearchProfileBody: React.FC = () => {
  // navigate 객체
  const navigate = useNavigate();

  const searchWord = useRecoilValue(searchWordAtom);

  const searchQueryAndFilterKey = useRecoilValue(searchQueryAndFilterKeyAtom);

  const { data } = QueryStatePostSearchListInfinite(searchQueryAndFilterKey);

  const setIsActiveSearchPostFilterPopup = useSetRecoilState(
    isActiveSearchPostFilterPopupAtom,
  );

  return (
    <SearchPostBodyContinaer>
      <SearchFilterContainer>
        <SearchPostFilterButtonWrap
          onClick={() => setIsActiveSearchPostFilterPopup(true)}
        >
          <PostSearchFilterButtonIcon />
        </SearchPostFilterButtonWrap>
      </SearchFilterContainer>
      <SearchPostContainer>
        {data && (
          <SnsPostMasonryLayout
            snsPostList={data.pages.flatMap((page) =>
              page.snsPostRspList.map((v) => v),
            )}
          />
        )}
        <SearchPostListInfiniteScroll
          searchQueryAndFilterKey={searchQueryAndFilterKey}
        />
      </SearchPostContainer>
    </SearchPostBodyContinaer>
  );
};

const SearchPostBodyContinaer = styled.div``;

const SearchFilterContainer = styled.div`
  position: sticky;
  z-index: 10;
  width: 100%;
  top: ${({ theme }) => theme.systemSize.header.height};
  background-color: ${({ theme }) => theme.mainColor.White};

  display: flex;
  justify-content: space-between;
`;

const SearchPostContainer = styled.div`
  padding-top: 10px;
`;

const SearchPostFilterButtonWrap = styled.div`
  margin: auto 10px auto 0px;
  display: flex;
`;

export default SearchProfileBody;
