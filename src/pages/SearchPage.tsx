import React, { useEffect } from 'react';

import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import SearchBody from '../components/search/body/SearchBody';

import BottomNavBar from 'components/BottomNavBar';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PullToRefreshComponent from 'components/PullToRefreshComponent';
import SearchHeader from 'components/search/header/SearchHeader';
import { EVENT_DATA_ROUTE_PREVIOUS_TAB_TYPE } from 'const/ReactNativeConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { handleMessageByRouteAndMoveUrl } from 'global/native/nativeHandleMessage';
import { isApp, sendInitEvent } from 'global/util/reactnative/nativeRouter';
import useBodyAdaptProps from 'hook/customhook/useBodyAdaptProps';
import { useMessageListener } from 'hook/customhook/useMessageListener';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateRecommTagList } from 'hook/queryhook/QueryStateRecommTagList';
import { QueryStateSearchFavoriteTermPreviewList } from 'hook/queryhook/QueryStateSearchFavoritePreviewTermList';
import { useNavigate } from 'react-router-dom';
import { initPageInfoAtom } from 'states/SystemConfigAtom';
import theme from 'styles/theme';
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

  const { windowWidth } = useWindowSize();

  const { refetch: refetchByFavoriteTermList } =
    QueryStateSearchFavoriteTermPreviewList();

  const { refetch: refetchByRecomMTagList } = QueryStateRecommTagList();

  const [initPageInfo, setInitPageInfo] = useRecoilState(initPageInfoAtom);
  useEffect(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        sendInitEvent();
        setInitPageInfo((prev) => ({ ...prev, isSearchPage: true }));
      }, 100);
    });
  }, []);

  useMessageListener((event) => {
    handleMessageByRouteAndMoveUrl(event, (url: string) => {
      navigate(url, { replace: true });
    });
  });

  useBodyAdaptProps([
    { key: 'overflow', value: 'hidden' },
    { key: 'touch-action', value: 'none' },
  ]);
  return (
    <>
      <div
        style={{
          opacity: initPageInfo.isSearchPage ? 1 : 0,
          transition: `opacity 0.3s ease-in`,
        }}
      >
        {isApp() ? (
          <>
            <SearchHeader
              backToUrl={HOME_PATH}
              searchUrl={SEARCH_POST_PATH}
              prevNavigateType={EVENT_DATA_ROUTE_PREVIOUS_TAB_TYPE}
            />
            <div
              style={{
                overflow: 'scroll',
                height: `calc(100dvh - ${
                  theme.systemSize.header.heightNumber +
                    parseFloat(
                      getComputedStyle(
                        document.documentElement,
                      ).getPropertyValue('--safe-area-inset-bottom'),
                    ) +
                    parseFloat(
                      getComputedStyle(
                        document.documentElement,
                      ).getPropertyValue('--safe-area-inset-top'),
                    ) || 0
                }px)`,
                marginTop: `calc(${theme.systemSize.header.height} + env(safe-area-inset-top))`,
              }}
            >
              {!isSearchInputActive && (
                <PullToRefreshComponent
                  onRefresh={async () => {
                    refetchByFavoriteTermList();
                    refetchByRecomMTagList();
                  }}
                >
                  <SearchBody />
                </PullToRefreshComponent>
              )}
            </div>
          </>
        ) : (
          <AppBaseTemplate>
            <SearchHeader
              backToUrl={HOME_PATH}
              searchUrl={SEARCH_POST_PATH}
              prevNavigateType={EVENT_DATA_ROUTE_PREVIOUS_TAB_TYPE}
            />
            {!isSearchInputActive && <SearchBody />}
          </AppBaseTemplate>
        )}
      </div>
      <BottomNavBar />
    </>
  );
};

export default SearchPage;
