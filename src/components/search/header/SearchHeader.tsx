import { QUERY_CACHE_TIME } from 'const/QueryClientConst';
import {
  SEARCH_POST_LASTEST_QUERY_PARAM,
  SEARCH_POST_MY_NEAR_QUERY_PARAM,
  SEARCH_POST_POPULAR_QUERY_PARAM,
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
import { NAVIGATION_TO } from '../../../const/AppConst';
import {
  DISPLAY_FLEX,
  DISPLAY_NONE,
  INIT_EMPTY_STRING_VALUE,
} from '../../../const/AttributeConst';
import { SEARCH_POST_FILTER_QUERY_PARAM } from '../../../const/QueryParamConst';
import { MAX_DELAY_SETTIMEOUT_TIME } from '../../../const/SystemAttrConst';
import { isValidString } from '../../../global/util/\bValidUtil';
import {
  isSearchInputActiveAtom,
  searchPostResultInfoAtom,
  searchQueryAndFilterKeyAtom,
  searchScrollPositionStateAtom,
  searchTempWordAtom,
  searchWordAtom,
} from '../../../states/SearchPostAtom';
import { animationStyle } from '../../../styles/animations';
import theme from '../../../styles/theme';
import PrevButton from '../../PrevButton';
import HeaderLayout from '../../layouts/HeaderLayout';
import SearchButtonInputElement from './SearchButtonInputElement';

import loadingBarGif from 'assets/images/gif/loadingBar.gif';

interface SearchHeaderProps {
  backToUrl: string;
  navigateType?: string;
  isShowFavoriteTermButton?: boolean;
  favoriteTermButton?: React.ReactNode;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  backToUrl,
  navigateType = NAVIGATION_TO,
  isShowFavoriteTermButton = false,
  favoriteTermButton,
}) => {
  const deleteButtonRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchScrollPositionState, setSearchScrollPositionState] =
    useRecoilState(searchScrollPositionStateAtom);

  const param = useParams();
  const searchWordText = param.search_word || INIT_EMPTY_STRING_VALUE;

  const [searchParams] = useSearchParams();
  const filterQueryParam = [
    SEARCH_POST_LASTEST_QUERY_PARAM,
    SEARCH_POST_MY_NEAR_QUERY_PARAM,
  ].includes(searchParams.get(SEARCH_POST_FILTER_QUERY_PARAM) || '')
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

  return (
    <>
      <HeaderLayout>
        <SearchHeaderWrap>
          <SearchContainerWrap>
            {!isSearchInputActive && (
              <PrevButtonWrap>
                <PrevButton
                  style={PrevStyle}
                  strokeColor={theme.mainColor.Black}
                  to={backToUrl}
                  type={navigateType}
                />
              </PrevButtonWrap>
            )}
            <SearchButtonInputElement
              searchInputRef={searchInputRef}
              deleteButtonRef={deleteButtonRef}
              setLoading={setLoading}
              isShowFavoriteTermButton={isShowFavoriteTermButton}
              favoriteTermButton={favoriteTermButton}
            />
          </SearchContainerWrap>
          {isSearchInputActive && (
            <SearchInputCancelButton onClick={onClickCancelSearchInput}>
              취소
            </SearchInputCancelButton>
          )}
        </SearchHeaderWrap>
      </HeaderLayout>
      {loading && isSearchInputActive && (
        <SearchLoadingWrap>
          <SearchLoadingGif src={loadingBarGif} />
        </SearchLoadingWrap>
      )}
    </>
  );
};

const LoadingBarSize = '50px';

const SearchHeaderWrap = styled.div`
  margin: auto 0;
  width: 100%;
  display: flex;
`;

const PrevButtonWrap = styled.div`
  display: flex;
`;

const PrevStyle: React.CSSProperties = {
  display: 'flex',
};

const SearchContainerWrap = styled.div`
  padding: 0 10px;
  display: flex;
  width: 100%;
`;

const SearchInputCancelButton = styled.div`
  margin: auto 0px;
  white-space: nowrap;
  padding-right: 20px;
  cursor: pointer;
  animation: ${animationStyle.slideLeft} 0.1s ease-in forwards;
`;

const SearchLoadingWrap = styled.div`
  position: fixed;
  top: calc(30%);
  left: 50%;
  transform: translate(-50%, 50%);
  z-index: 100;
`;

const SearchLoadingGif = styled.img`
  width: ${LoadingBarSize};
  height: ${LoadingBarSize};
`;

export default SearchHeader;
