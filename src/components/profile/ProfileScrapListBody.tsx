import { queryClient } from 'App';
import PullToRefreshComponent from 'components/PullToRefreshComponent';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_PROFILE_SCRAP_LIST } from 'const/QueryClientConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { stackRouterPush } from 'global/util/reactnative/nativeRouter';
import useWindowSize from 'hook/customhook/useWindowSize';
import {
  ProfileScrapListQueryInterface,
  QueryStateProfileScrapList,
} from 'hook/queryhook/QueryStateProfileScrapList';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfileScrapList } from 'services/profile/getProfileScrapList';
import styled from 'styled-components';
import { PROFILE_SCRAP_LIST_PATH } from '../../const/PathConst';
import ProfileScrapViewBody from '../common/body/ProfileScrapViewBody';
import ProfileMakeScrapFloatingButton from './ProfileMakeScrapFloatingButton';

const ProfileScrapListBody: React.FC = () => {
  const navigate = useNavigate();

  const { windowWidth } = useWindowSize();

  const { data: profileScrapList, isFetched: isFetchedByProfileScrapList } =
    QueryStateProfileScrapList();

  return (
    <ProfileScrapListContainer>
      <PullToRefreshComponent
        onRefresh={async () => {
          const fetchData = await getProfileScrapList(PAGE_NUM);

          const data: ProfileScrapListQueryInterface = {
            pageParams: [PAGE_NUM],
            pages: [[...fetchData]],
          };

          queryClient.setQueryData([QUERY_STATE_PROFILE_SCRAP_LIST], data);
        }}
      >
        <ProfileScrapListBodyContainer>
          <ProfileScrapViewBody
            onButtonEvent={({ scrapId, scrapName }) => {
              stackRouterPush(
                navigate,
                `${PROFILE_SCRAP_LIST_PATH}/${scrapId}`,
              );
            }}
          />
        </ProfileScrapListBodyContainer>
      </PullToRefreshComponent>
      {windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM && (
        <ProfileMakeScrapFloatingButton
          isShow={
            (isFetchedByProfileScrapList &&
              profileScrapList &&
              profileScrapList?.pages.flatMap((v) => v).length > 0) ||
            false
          }
        />
      )}
    </ProfileScrapListContainer>
  );
};

const ProfileScrapListContainer = styled.div`
  // padding-top: 20px;
`;

const ProfileScrapListBodyContainer = styled.div``;

export default ProfileScrapListBody;
