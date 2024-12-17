import React, { useEffect } from 'react';

import { useRecoilValue, useResetRecoilState } from 'recoil';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import SearchBody from '../components/search/body/SearchBody';

import SearchHeader from 'components/search/header/SearchHeader';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { useNavigate } from 'react-router-dom';
import SearchSuggestBody from '../components/search/body/SearchSuggestBody';
import { HOME_PATH, SEARCH_POST_PATH } from '../const/PathConst';
import {
  isSearchInputActiveAtom,
  searchWordAtom,
} from '../states/SearchPostAtom';

const SearchPage: React.FC = () => {
  const isSearchInputActive = useRecoilValue(isSearchInputActiveAtom);
  const resetSearchWord = useResetRecoilState(searchWordAtom);

  const navigate = useNavigate();

  useEffect(() => {
    resetSearchWord();
    window.scrollTo(0, 0);

    const handleResize = () => {
      if (window.innerWidth > MEDIA_MOBILE_MAX_WIDTH_NUM) {
        // 화면 크기가 768px 이상이면 홈페이지로 리다이렉트
        navigate(HOME_PATH);
      }
    };

    // 페이지 로드시 크기 확인
    handleResize();

    // 창 크기 변경시 크기 확인
    window.addEventListener('resize', handleResize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <AppBaseTemplate>
      <SearchHeader backToUrl={HOME_PATH} searchUrl={SEARCH_POST_PATH} />
      {!isSearchInputActive && <SearchBody />}
      {isSearchInputActive && <SearchSuggestBody />}
      {/* <BottomNavBar /> */}
    </AppBaseTemplate>
  );
};

export default SearchPage;
