import BorderCircleButton from 'components/common/buttton/BorderCircleButton';
import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import { SEARCH_POST_PATH } from 'const/PathConst';
import { SEARCH_POST_FILTER_QUERY_PARAM } from 'const/QueryParamConst';
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
  SearchPostFilterTabType,
} from 'const/TabConfigConst';
import { getUnifiedPosition } from 'global/util/PositionUtil';
import { isValidString } from 'global/util/ValidUtil';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentPositionSearchPostAtom,
  searchPostExploreFilterTabAtom,
  searchWordAtom,
} from 'states/SearchPostAtom';
import styled from 'styled-components';
import theme from 'styles/theme';

interface SearchPostExploreFilterProps {
  SearchPostExploreFilterStyle?: React.CSSProperties;
}

const SearchPostExploreFilter: React.FC<SearchPostExploreFilterProps> = ({
  SearchPostExploreFilterStyle,
}) => {
  const searchWord = useRecoilValue(searchWordAtom);
  const [searchPostExploreFilterTab, setSearchPostExploreFilterTab] =
    useRecoilState(searchPostExploreFilterTabAtom);

  const setCurrentPositionSearchPost = useSetRecoilState(
    currentPositionSearchPostAtom,
  );

  const navigate = useNavigate();

  const [queryParam] = useSearchParams();

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

  const isSearchPostFilterTabType = (
    value: string | null,
  ): value is SearchPostFilterTabType =>
    value === SEARCH_POST_POPULAR_QUERY_PARAM ||
    value === SEARCH_POST_LASTEST_QUERY_PARAM ||
    value === SEARCH_POST_MY_NEAR_QUERY_PARAM;

  useEffect(() => {
    setSearchPostExploreFilterTab(
      isSearchPostFilterTabType(queryParam.get(SEARCH_POST_FILTER_QUERY_PARAM))
        ? (queryParam.get(
            SEARCH_POST_FILTER_QUERY_PARAM,
          ) as SearchPostFilterTabType)
        : searchPostTabList[0].queryParam,
    );
    if (
      queryParam.get(SEARCH_POST_FILTER_QUERY_PARAM) ===
      SEARCH_POST_MY_NEAR_QUERY_PARAM
    ) {
      getUnifiedPosition({
        actionFunc: (value) => {
          setCurrentPositionSearchPost({
            latitude: value.latitude,
            longitude: value.longitude,
          });
        },
      });
    }
  }, [queryParam]);
  return (
    <>
      <SearchFilterWrap style={SearchPostExploreFilterStyle}>
        {searchPostTabList.map((v) => (
          <BorderCircleButton
            key={v.tabId}
            contentText={v.tabName}
            BorderCircleButtonStyle={{ fontSize: '15px' }}
            className={
              searchPostExploreFilterTab === v.queryParam
                ? ACTIVE_CLASS_NAME
                : ''
            }
            onClickFunc={() => {
              // setSearchPostExploreFilterTab(v.queryParam);
              if (
                isValidString(searchWord) &&
                searchPostExploreFilterTab !== v.queryParam
              ) {
                let searchResultPath = `${SEARCH_POST_PATH}/${searchWord}`;
                if (v.tabId !== SEARCH_POST_POPULAR_FILTER_ID) {
                  searchResultPath += `?${SEARCH_POST_FILTER_QUERY_PARAM}=${v.queryParam}`;
                }
                navigate(searchResultPath, { replace: true });
              }
            }}
            deactiveBorderColor={theme.grey.Grey2}
            activeFontColor={theme.mainColor.Blue}
            activeBorderColor={theme.mainColor.Blue}
          />
        ))}
      </SearchFilterWrap>
    </>
  );
};

const SearchFilterWrap = styled.div`
  padding: 6px;
  display: flex;
  gap: 6px;
`;

export default SearchPostExploreFilter;
