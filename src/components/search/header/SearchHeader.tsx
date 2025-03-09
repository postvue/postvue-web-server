import { QUERY_CACHE_TIME } from 'const/QueryClientConst';
import {
  SEARCH_POST_LASTEST_QUERY_PARAM,
  SEARCH_POST_MY_NEAR_QUERY_PARAM,
  SEARCH_POST_POPULAR_QUERY_PARAM,
  SearchPostFilterTabType,
} from 'const/TabConfigConst';
import { getIsRetentionTimeInMinutes } from 'global/util/DateTimeUtil';
import {
  decodeSearhWordAndFilterKey,
  encodeSearhWordAndFilterKey,
  isValidSearchWordAndFilterKey,
} from 'global/util/SearchPostUtil';
import React, { useEffect, useRef, useState } from 'react';
import {
  NavigationType,
  useNavigationType,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import {
  DISPLAY_FLEX,
  DISPLAY_NONE,
  INIT_EMPTY_STRING_VALUE,
} from '../../../const/AttributeConst';
import { SEARCH_POST_FILTER_QUERY_PARAM } from '../../../const/QueryParamConst';
import {
  MAX_DELAY_SETTIMEOUT_TIME,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from '../../../const/SystemAttrConst';
import { isValidString } from '../../../global/util/ValidUtil';
import {
  isSearchInputActiveAtom,
  searchPostResultInfoAtom,
  searchQueryAndFilterKeyAtom,
  searchScrollPositionStateAtom,
  searchTempWordAtom,
  searchWordAtom,
} from '../../../states/SearchPostAtom';
import theme from '../../../styles/theme';
import PrevButton from '../../PrevButton';
import HeaderLayout from '../../layouts/HeaderLayout';
import SearchButtonInputElement from './SearchButtonInputElement';

import LoadingComponent from 'components/common/container/LoadingComponent';
import { SEARCH_TAG_POST_PATH } from 'const/PathConst';
import { EVENT_DATA_ROUTE_BACK_TYPE } from 'const/ReactNativeConst';
import useOutsideClick from 'hook/customhook/useOutsideClick';
import useWindowSize from 'hook/customhook/useWindowSize';
import SearchSuggestBody from '../body/SearchSuggestBody';

interface SearchHeaderProps {
  backToUrl: string;
  searchUrl: string;
  prevNavigateType?: string;
  isShowFavoriteTermButton?: boolean;
  favoriteTermButton?: React.ReactNode;
  SearchHeaderContainerStyle?: React.CSSProperties;
  SearchButtonInputLayoutStyle?: React.CSSProperties;
  isPrevButton?: boolean;
  SearchSuggestBodyContiainerStyle?: React.CSSProperties;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  backToUrl,
  searchUrl,
  prevNavigateType = EVENT_DATA_ROUTE_BACK_TYPE,
  isShowFavoriteTermButton = false,
  favoriteTermButton,
  SearchHeaderContainerStyle,
  SearchButtonInputLayoutStyle,
  isPrevButton = true,
  SearchSuggestBodyContiainerStyle,
}) => {
  const deleteButtonRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchScrollPositionState, setSearchScrollPositionState] =
    useRecoilState(searchScrollPositionStateAtom);

  const param = useParams();
  const [searchParams] = useSearchParams();
  const searchWordText = param.search_word
    ? location.pathname.startsWith(SEARCH_TAG_POST_PATH)
      ? '#' + param.search_word
      : param.search_word
    : INIT_EMPTY_STRING_VALUE;

  const isSearchPostFilterTabType = (
    value: string | null,
  ): value is SearchPostFilterTabType =>
    value === SEARCH_POST_LASTEST_QUERY_PARAM ||
    value === SEARCH_POST_MY_NEAR_QUERY_PARAM;

  const filterQueryParam = isSearchPostFilterTabType(
    searchParams.get(SEARCH_POST_FILTER_QUERY_PARAM),
  )
    ? searchParams.get(SEARCH_POST_FILTER_QUERY_PARAM) ||
      SEARCH_POST_POPULAR_QUERY_PARAM
    : SEARCH_POST_POPULAR_QUERY_PARAM;

  // 검색어가 없을 시 무조건 빈 문자열, 검색어는 있고 필터 query가 없을 시 검색어 만, 있을 시 검색어_필터
  const [searchQueryAndFilterKey, setSearchQueryAndFilterKey] = useRecoilState(
    searchQueryAndFilterKeyAtom,
  );

  const setSearchWord = useSetRecoilState(searchWordAtom);

  const setSearchTempWord = useSetRecoilState(searchTempWordAtom);

  const [loading, setLoading] = useState(false); // Loading state

  // 검색 입력 focus 관련 상태 관리
  const [isSearchInputActive, setIsSearchInputActive] = useRecoilState(
    isSearchInputActiveAtom,
  );

  const [searchPostResultInfo, setSearchPostResultInfo] = useRecoilState(
    searchPostResultInfoAtom,
  );

  const onClickCancelSearchInput = () => {
    setIsSearchInputActive(false);
  };

  const insertSearchPostResultInfo = (searchWord: string) => {
    if (!isValidString(searchWord)) return;
    const tempSearchPostResultInfo = new Map(searchPostResultInfo);

    tempSearchPostResultInfo.set(searchWord, {
      position: searchScrollPositionState,
      savedTime: new Date(),
      retentionMinutes: QUERY_CACHE_TIME,
    });

    setSearchPostResultInfo(tempSearchPostResultInfo);
  };

  const navigationType = useNavigationType();

  // 검색어 바뀔 때 마다 렌더링
  useEffect(() => {
    // 검색 페이지 검색어 바뀔 때마다 입력 활성화 비활성화
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }

    // 검색어 없을 시 return
    if (!searchQueryAndFilterKey) return;

    // 새로운 페이지 들어갈 시(push) 검색 페이지 기록 제거
    if (navigationType === NavigationType.Push) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, MAX_DELAY_SETTIMEOUT_TIME);
    }
    // 이전 페이지로 들어갈 시(popup) 검색 페이지 기록 리스트에서 상태 값 가져오기
    if (navigationType === NavigationType.Pop) {
      const query = searchPostResultInfo.get(searchQueryAndFilterKey);
      if (query) {
        // 마운트 된 상태에서 위치 이동
        if (
          getIsRetentionTimeInMinutes(query.savedTime, query.retentionMinutes)
        ) {
          setTimeout(() => {
            window.scrollTo(0, query.position);
          }, MAX_DELAY_SETTIMEOUT_TIME);
        }
      }
    }

    setSearchWord(searchWordText);
    setSearchTempWord(searchWordText);

    return () => {
      setSearchTempWord(INIT_EMPTY_STRING_VALUE);
      setIsSearchInputActive(false);
    };
  }, [searchQueryAndFilterKey]);

  // 입력 창 홠성화 관련 렌더링
  useEffect(() => {
    if (deleteButtonRef.current) {
      deleteButtonRef.current.style.display = isSearchInputActive
        ? DISPLAY_FLEX
        : DISPLAY_NONE;
    }
    if (!isSearchInputActive) {
      setSearchTempWord(searchWordText);

      //@REFEC: 좀 있다 지우기
      // window.scrollTo(0, searchScrollPositionRef.current);
      // searchScrollPositionRef.current = 0;
    }
  }, [isSearchInputActive]);

  useEffect(() => {
    if (
      decodeSearhWordAndFilterKey(
        encodeSearhWordAndFilterKey(searchWordText, filterQueryParam),
      ).length !== 2
    )
      return;
    setSearchQueryAndFilterKey(
      encodeSearhWordAndFilterKey(searchWordText, filterQueryParam),
    );
  }, [searchWordText, filterQueryParam]);

  // 현재 위치 값 바뀔 시 렌더링
  useEffect(() => {
    // 뒤로 가기 시 스크롤 위치 복원
    const handleScroll = () => {
      // 검색어 바뀔 떄 마다 이전 검색 페이지 결과 및 위치 값 기록
      setSearchScrollPositionState(window.scrollY);

      if (isValidSearchWordAndFilterKey(searchQueryAndFilterKey)) {
        insertSearchPostResultInfo(searchQueryAndFilterKey);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [searchScrollPositionState]);

  const { windowWidth } = useWindowSize();

  const searchHeaderRef = useRef<HTMLDivElement>(null);

  const suggestBodyRef = useRef<HTMLDivElement>(null);

  useOutsideClick([searchHeaderRef, suggestBodyRef], () => {
    setIsSearchInputActive(false);
  });

  return (
    <>
      <div
        style={{
          position:
            windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? 'sticky' : 'static',
          zIndex: '100',
          top: windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? 0 : 'none',
        }}
      >
        <HeaderLayout
          HeaderLayoutStyle={{
            ...{
              position:
                windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM
                  ? 'absolute'
                  : 'fixed',
              maxWidth:
                windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM
                  ? theme.systemSize.appDisplaySize.widthByPc
                  : theme.systemSize.appDisplaySize.maxWidth,
              zIndex: 300,
            },
            ...SearchHeaderContainerStyle,
          }}
          HeaderLayoutRef={searchHeaderRef}
        >
          <SearchHeaderWrap>
            <SearchInpuElementWrap>
              <SearchContainerWrap>
                {isPrevButton && (
                  <PrevButtonWrap $shrink={!isSearchInputActive}>
                    <PrevButton
                      style={PrevStyle}
                      to={backToUrl}
                      type={prevNavigateType}
                    />
                  </PrevButtonWrap>
                )}

                <SearchInpuElementSubWrap>
                  <SearchButtonInputElement
                    searchInputRef={searchInputRef}
                    deleteButtonRef={deleteButtonRef}
                    setLoading={setLoading}
                    isShowFavoriteTermButton={isShowFavoriteTermButton}
                    favoriteTermButton={favoriteTermButton}
                    searchUrl={searchUrl}
                    SearchButtonInputLayoutStyle={SearchButtonInputLayoutStyle}
                  />
                </SearchInpuElementSubWrap>
              </SearchContainerWrap>
            </SearchInpuElementWrap>
            <SearchInputCancelButtonWrap $shrink={isSearchInputActive}>
              <SearchInputCancelButton onClick={onClickCancelSearchInput}>
                취소
              </SearchInputCancelButton>
            </SearchInputCancelButtonWrap>
          </SearchHeaderWrap>
        </HeaderLayout>
        {isSearchInputActive && (
          <SearchSuggestBody
            suggestBodyRef={suggestBodyRef}
            SearchSuggestBodyContiainerStyle={SearchSuggestBodyContiainerStyle}
          />
        )}
      </div>

      {loading && isSearchInputActive && (
        <LoadingComponent
          LoadingComponentStyle={{
            top: `${theme.systemSize.header.heightNumber * 4}px`,
            transform: 'translate(-50%,0px)',
          }}
        />
      )}
    </>
  );
};

const SearchHeaderWrap = styled.div`
  margin: auto 0;
  width: 100%;
  display: flex;
`;

const PrevButtonWrap = styled.div<{ $shrink: boolean }>`
  display: flex;

  transition:
    width 0.3s ease,
    opacity 0.3s ease;
  flex: 0 0 auto;
  width: ${(props) => (props.$shrink ? '20px' : '0')};
  opacity: ${(props) => (props.$shrink ? '1' : '0')};
  overflow: hidden;
`;

const PrevStyle: React.CSSProperties = {
  display: 'flex',
};

const SearchContainerWrap = styled.div`
  padding: 0 10px;
  display: flex;
  width: 100%;
`;

const SearchInpuElementWrap = styled.div`
  display: flex;
  transition: flex 0.5s ease;
  flex: 1;
  width: auto;
  opacity: 1;
  overflow: hidden;
`;

const SearchInpuElementSubWrap = styled.div`
  display: flex;
  transition: flex 0.3s ease;
  flex: 1;
  width: auto;
  opacity: 1;
  overflow: hidden;
`;

const SearchInputCancelButtonWrap = styled.div<{ $shrink: boolean }>`
  display: flex;
  border-radius: 5px;
  transition:
    width 0.5s ease,
    opacity 0.5s ease;
  flex: 0 0 auto;
  width: ${(props) => (props.$shrink ? '50px' : '0')};
  opacity: ${(props) => (props.$shrink ? '1' : '0')};
  overflow: hidden;
`;

const SearchInputCancelButton = styled.div`
  margin: auto 0px;
  white-space: nowrap;
  padding-right: 20px;
  cursor: pointer;
  font: ${({ theme }) => theme.fontSizes.Body4};
`;

export default SearchHeader;
