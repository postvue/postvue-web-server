import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { MasonryPostRsp } from '../../../global/interface/post';

import styled from 'styled-components';
import { ACTIVE_CLASS_NAME } from '../../../const/ClassNameConst';

import { SEARCH_PATH } from 'const/PathConst';
import { SEARCH_POST_FILTER_QUERY_PARAM } from 'const/QueryParamConst';
import { isValidString } from 'global/util/ValidUtil';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  SEARCH_POST_LASTEST_FILTER_ID,
  SEARCH_POST_LASTEST_FILTER_NAME,
  SEARCH_POST_LASTEST_QUERY_PARAM,
  SEARCH_POST_MY_NEAR_FILTER_ID,
  SEARCH_POST_MY_NEAR_FILTER_NAME,
  SEARCH_POST_MY_NEAR_QUERY_PARAM,
  SEARCH_POST_POPULAR_FILTER_ID,
  SEARCH_POST_POPULAR_FILTER_NAME,
  SEARCH_POST_POPULAR_QUERY_PARAM,
} from '../../../const/TabConfigConst';
import {
  searchPostHashMapAtom,
  searchQueryAndFilterKeyAtom,
  searchWordAtom,
} from '../../../states/SearchPostAtom';
import theme from '../../../styles/theme';
import MasonryLayout from '../../layouts/MasonryLayout';

interface SearchPostBodyProps {
  searchPostBodyContainerStyle?: React.CSSProperties;
}

const SearchPostBodyBeta: React.FC<SearchPostBodyProps> = ({
  searchPostBodyContainerStyle,
}) => {
  const searchPostHashMap = useRecoilValue(searchPostHashMapAtom);
  const [queryParam] = useSearchParams();

  const searchWord = useRecoilValue(searchWordAtom);
  const SearchPostAreaRef = useRef<HTMLDivElement>(null);

  const searchQueryAndFilterKey = useRecoilValue(searchQueryAndFilterKeyAtom);

  const searchPostTabList = [
    {
      tabId: SEARCH_POST_POPULAR_FILTER_ID,
      tabName: SEARCH_POST_POPULAR_FILTER_NAME,
      queryParam: SEARCH_POST_POPULAR_QUERY_PARAM,
    },
    {
      tabId: SEARCH_POST_LASTEST_FILTER_ID,
      tabName: SEARCH_POST_LASTEST_FILTER_NAME,
      queryParam: SEARCH_POST_LASTEST_QUERY_PARAM,
    },
    {
      tabId: SEARCH_POST_MY_NEAR_FILTER_ID,
      tabName: SEARCH_POST_MY_NEAR_FILTER_NAME,
      queryParam: SEARCH_POST_MY_NEAR_QUERY_PARAM,
    },
  ];

  const [searchPostFilterTab, setSearchPostFilterTab] = useState<string>(
    searchPostTabList[0].queryParam,
  );

  // navigate 객체
  const navigate = useNavigate();

  useEffect(() => {
    setSearchPostFilterTab(
      queryParam.get(SEARCH_POST_FILTER_QUERY_PARAM) ||
        searchPostTabList[0].queryParam,
    );
  }, [queryParam.get(SEARCH_POST_FILTER_QUERY_PARAM)]);

  return (
    <SearchPostBodyContinaer style={searchPostBodyContainerStyle}>
      <SearchFilterContainer>
        <SearchFilterWrap>
          {searchPostTabList.map((v, i) => (
            <SearchFilterItem
              key={v.tabId}
              className={
                searchPostFilterTab === v.queryParam ? ACTIVE_CLASS_NAME : ''
              }
              onClick={() => {
                setSearchPostFilterTab(v.queryParam);
                if (
                  isValidString(searchWord) &&
                  searchPostFilterTab !== v.queryParam
                ) {
                  let searchResultPath = `${SEARCH_PATH}/${searchWord}`;
                  if (v.tabId !== SEARCH_POST_POPULAR_FILTER_ID) {
                    searchResultPath += `?${SEARCH_POST_FILTER_QUERY_PARAM}=${v.queryParam}`;
                  }
                  navigate(searchResultPath);
                }
              }}
            >
              {v.tabName}
            </SearchFilterItem>
          ))}
        </SearchFilterWrap>
      </SearchFilterContainer>
      <SearchPostContainer ref={SearchPostAreaRef}>
        <MasonryLayout
          snsPostUrlList={Array.from(searchPostHashMap.entries()).map(
            ([, v]) => {
              // @REFER: 나중에 잘못 될 수 있으니 참고
              // let imageContent = v.postContents.find(
              //   (postContent) =>
              //     postContent.postContentType !== POST_TEXTFIELD_TYPE,
              // )?.content;
              // imageContent = imageContent ? imageContent : NO_IMAGE_DATA_LINK;

              const postContent = v.postContents[0];
              const homePostRsp: MasonryPostRsp = {
                postId: v.postId,
                userId: v.userId,
                postContent: postContent.content,
                postContentType: postContent.postContentType,
                username: v.username,
                location: v.location,
              };

              return homePostRsp;
            },
          )}
        />
        {/* <SearchPostListInfiniteScroll searchWord={searchWord} /> */}
      </SearchPostContainer>
      {/* <FloatingActionButtonLayout FloatingActionAreaRef={SearchPostAreaRef}>
        테스트
      </FloatingActionButtonLayout> */}
    </SearchPostBodyContinaer>
  );
};

const SearchPostBodyContinaer = styled.div`
  margin-top: ${theme.systemSize.header.height};
`;

const SearchFilterWrap = styled.div`
  padding: 12px 6px 6px 6px;
  display: flex;
  gap: 6px;
`;

const SearchFilterContainer = styled.div`
  position: fixed;
  z-index: 10;
  width: 100%;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  background-color: ${({ theme }) => theme.mainColor.White};
`;

const SearchFilterItem = styled.div`
  padding: 5px 12px;
  border-radius: 40px;
  border: 1px solid ${({ theme }) => theme.grey.Grey2};
  font: ${({ theme }) => theme.fontSizes.Body2};
  cursor: pointer;

  &.${ACTIVE_CLASS_NAME} {
    border-color: ${({ theme }) => theme.mainColor.Blue};
    color: ${({ theme }) => theme.mainColor.Blue};
  }
`;

const SearchPostContainer = styled.div`
  padding-top: 60px;
`;

export default SearchPostBodyBeta;
