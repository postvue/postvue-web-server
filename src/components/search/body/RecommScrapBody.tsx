import ProfileScrapThumbnailListView from 'components/common/body/ProfileScrapThumbnailListView';
import NoResultComponentInfinite from 'components/common/container/NoResultComponentInfitie';
import { PROFILE_SCRAP_LIST_PATH } from 'const/PathConst';
import { RoutePushEventDateInterface } from 'const/ReactNativeConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { stackRouterPush } from 'global/util/reactnative/nativeRouter';
import { QueryStateRecommScrapListInfinite } from 'hook/queryhook/QueryStateRecommScrapListInfinite';
import RecommScrapListInfiniteScroll from 'hook/RecommScrapListInfiniteScroll';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import theme from 'styles/theme';

interface RecommScrapBodyProps {
  ContainerStyle?: React.CSSProperties;
}

const RecommScrapBody: React.FC<RecommScrapBodyProps> = ({
  ContainerStyle,
}) => {
  const navigate = useNavigate();
  const { data, isFetched } = QueryStateRecommScrapListInfinite();

  return (
    <SearchScrapListContainer style={ContainerStyle}>
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

      <RecommScrapListInfiniteScroll />
    </SearchScrapListContainer>
  );
};

const SearchScrapListContainer = styled.div`
  height: 100%;
  min-height: calc(100dvh - ${theme.systemSize.header.height});

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    padding-top: ${theme.systemSize.header.heightNumber + 10}px;
    min-height: calc(100dvh - ${theme.systemSize.header.heightNumber + 10}px);
  }
`;

export default RecommScrapBody;
