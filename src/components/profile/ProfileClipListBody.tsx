import ProfileClipListInfiniteScroll from 'hook/ProfileClipListInfiniteScroll';
import React from 'react';
import styled from 'styled-components';

import { queryClient } from 'App';
import SnsPostMasonryLayout from 'components/layouts/SnsPostMasonryLayout';
import PullToRefreshComponent from 'components/PullToRefreshComponent';
import { INIT_CURSOR_ID } from 'const/PageConfigConst';
import { QUERY_STATE_PROFILE_CLIP_LIST } from 'const/QueryClientConst';
import {
  ProfileClipListQueryInterface,
  QueryStateProfileClipListInfinite,
} from 'hook/queryhook/QueryStateProfileClipListInfinite';
import { getMyProfileClipList } from 'services/profile/getProfileClipList';
import theme from 'styles/theme';
const ProfileClipListBody: React.FC = () => {
  const { data: myProfileClipList } = QueryStateProfileClipListInfinite();

  return (
    <div>
      <PullToRefreshComponent
        onRefresh={async () => {
          const fetchData = await getMyProfileClipList(INIT_CURSOR_ID);

          const data: ProfileClipListQueryInterface = {
            pageParams: [INIT_CURSOR_ID],
            pages: [{ ...fetchData }],
          };

          queryClient.setQueryData([QUERY_STATE_PROFILE_CLIP_LIST], data);
        }}
      >
        <ProfileClipBodyContainer>
          <div style={{ paddingTop: '10px' }}></div>
          {myProfileClipList && (
            <SnsPostMasonryLayout
              snsPostList={myProfileClipList?.pages.flatMap((v) =>
                v.snsPostRspList.map((value) => value),
              )}
            />
          )}
          {myProfileClipList &&
            myProfileClipList?.pages.flatMap((v) => v.snsPostRspList).length <=
              0 && (
              <ProifileNotClipTitleWrap>
                <ProifileNotClipTitle>저장한 클립이 없음</ProifileNotClipTitle>
              </ProifileNotClipTitleWrap>
            )}

          <ProfileClipListInfiniteScroll />
        </ProfileClipBodyContainer>
      </PullToRefreshComponent>
    </div>
  );
};

const ProfileClipBodyContainer = styled.div`
  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
  min-height: calc(100dvh - ${theme.systemSize.header.height});
`;

const ProifileNotClipTitleWrap = styled.div`
  display: flex;
`;

const ProifileNotClipTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body5};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
`;

export default ProfileClipListBody;
