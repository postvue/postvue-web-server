import ProfileScrapThumbnailListView from 'components/common/body/ProfileScrapThumbnailListView';
import NoResultComponentInfinite from 'components/common/container/NoResultComponentInfitie';
import { PROFILE_SCRAP_LIST_PATH } from 'const/PathConst';
import { RoutePushEventDateInterface } from 'const/ReactNativeConst';
import {
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import { stackRouterPush } from 'global/util/reactnative/nativeRouter';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateSearchScrapListInfinite } from 'hook/queryhook/QueryStateSearchScrapListInfinite';
import SearchScrapListInfiniteScroll from 'hook/SearchScrapListInfiniteScroll';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { searchWordAtom } from 'states/SearchPostAtom';
import styled from 'styled-components';
import theme from 'styles/theme';
import SearchFilterButton from './SearchFilterButton';

const SearchScrapBody: React.FC = () => {
  const searchWord = useRecoilValue(searchWordAtom);
  const navigate = useNavigate();
  const {
    data,
    isFetched,
    refetch: refetchByScrapList,
  } = QueryStateSearchScrapListInfinite(searchWord);

  const { windowWidth } = useWindowSize();

  return (
    <SearchScrapBodyContainer>
      {windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM && (
        <SearchFilterContainer>
          <SearchFilterButton />
        </SearchFilterContainer>
      )}

      <SearchScrapListContainer>
        {data && (
          <ProfileScrapThumbnailListView
            profileThumbnailScrapList={data?.pages.flatMap((value) => value)}
            isAddMove={false}
            onButtonEvent={({ scrapId, scrapName }) => {
              const data: RoutePushEventDateInterface = {
                isShowInitBottomNavBar: true,
              };
              stackRouterPush(
                navigate,
                `${PROFILE_SCRAP_LIST_PATH}/${scrapId}`,
                data,
              );
            }}
          />
        )}
        {isFetched &&
          data &&
          data?.pages.flatMap((value) => value).length <= 0 && (
            <NoResultComponentInfinite />
          )}

        <SearchScrapListInfiniteScroll searchQuery={searchWord} />
      </SearchScrapListContainer>
    </SearchScrapBodyContainer>
  );
};

const SearchScrapBodyContainer = styled.div``;

const SearchScrapListContainer = styled.div`
  height: 100%;
  min-height: calc(100dvh - ${theme.systemSize.header.height});
  padding-top: ${({ theme }) => theme.systemSize.header.heightNumber}px;
  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    padding-top: ${theme.systemSize.header.heightNumber + 10}px;
    min-height: calc(100dvh - ${theme.systemSize.header.heightNumber + 10}px);
  }
`;

const SearchFilterContainer = styled.div`
  position: fixed;
  padding-top: env(safe-area-inset-top);
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};

  z-index: 10;
  width: 100%;
  top: ${({ theme }) => theme.systemSize.header.height};
  background-color: ${({ theme }) => theme.mainColor.White};

  display: flex;
  justify-content: end;
  height: ${({ theme }) => theme.systemSize.header.height};
`;

export default SearchScrapBody;
