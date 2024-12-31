import ProfileScrapThumbnailListView from 'components/common/body/ProfileScrapThumbnailListView';
import NoResultComponent from 'components/common/container/NoResultComponent';
import { PROFILE_SCRAP_LIST_PATH } from 'const/PathConst';
import {
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import { stackRouterPush } from 'global/util/reactnative/StackRouter';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateSearchScrapListInfinite } from 'hook/queryhook/QueryStateSearchScrapListInfinite';
import SearchScrapListInfiniteScroll from 'hook/SearchScrapListInfiniteScroll';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { searchWordAtom } from 'states/SearchPostAtom';
import styled from 'styled-components';
import SearchFilterButton from './SearchFilterButton';

const SearchScrapBody: React.FC = () => {
  const searchWord = useRecoilValue(searchWordAtom);
  const navigate = useNavigate();
  const { data, isFetched } = QueryStateSearchScrapListInfinite(searchWord);

  const { windowWidth } = useWindowSize();

  return (
    <SearchScrapBodyContainer>
      {windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <SearchFilterContainer>
          <SearchFilterButton />
        </SearchFilterContainer>
      ) : (
        <ContainerMargin />
      )}

      {data && (
        <ProfileScrapThumbnailListView
          profileThumbnailScrapList={data?.pages.flatMap((value) => value)}
          isAddMove={false}
          onButtonEvent={(scrapId: string) => {
            stackRouterPush(navigate, `${PROFILE_SCRAP_LIST_PATH}/${scrapId}`);
          }}
        />
      )}
      {isFetched &&
        data &&
        data?.pages.flatMap((value) => value).length <= 0 && (
          <NoResultComponent />
        )}

      <SearchScrapListInfiniteScroll searchQuery={searchWord} />
    </SearchScrapBodyContainer>
  );
};

const SearchScrapBodyContainer = styled.div`
  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    margin-top: ${({ theme }) => theme.systemSize.header.heightNumber}px;
  }
`;

const SearchFilterContainer = styled.div`
  position: sticky;
  z-index: 10;
  width: 100%;
  top: ${({ theme }) => theme.systemSize.header.height};
  background-color: ${({ theme }) => theme.mainColor.White};

  display: flex;
  justify-content: end;
  height: ${({ theme }) => theme.systemSize.header.height};
`;

const ContainerMargin = styled.div`
  margin-top: 10px;
`;

export default SearchScrapBody;
