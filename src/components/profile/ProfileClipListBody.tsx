import ProfileClipListInfiniteScroll from 'hook/ProfileClipListInfiniteScroll';
import React from 'react';
import styled from 'styled-components';

import { queryClient } from 'App';
import { ReactComponent as EmptyClipIcon } from 'assets/images/icon/svg/empty/EmptyClipIcon.svg';
import SnsPostMasonryLayout from 'components/layouts/SnsPostMasonryLayout';
import PullToRefreshComponent from 'components/PullToRefreshComponent';
import { INIT_CURSOR_ID } from 'const/PageConfigConst';
import { HOME_PATH } from 'const/PathConst';
import { QUERY_STATE_PROFILE_CLIP_LIST } from 'const/QueryClientConst';
import { HOME_PAGE_NAME, isMainTab } from 'const/ReactNativeConst';
import {
  navigateToMainTab,
  navigateToTabWithUrl,
} from 'global/util/reactnative/nativeRouter';
import {
  ProfileClipListQueryInterface,
  QueryStateProfileClipListInfinite,
} from 'hook/queryhook/QueryStateProfileClipListInfinite';
import { useNavigate } from 'react-router-dom';
import { getMyProfileClipList } from 'services/profile/getProfileClipList';
import theme from 'styles/theme';
const ProfileClipListBody: React.FC = () => {
  const { data: myProfileClipList } = QueryStateProfileClipListInfinite();
  const navigate = useNavigate();

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
                <ProifileNotClipWrap>
                  <ProifileNotClipIconWrap>
                    <EmptyClipIcon />
                  </ProifileNotClipIconWrap>
                  <ProifileNotClipTitle>저장 없음</ProifileNotClipTitle>
                  <ProifileNotClipTitle>
                    이런 컨텐츠는 어떠세요?
                  </ProifileNotClipTitle>
                  <MakeScrapButton
                    onClick={() => {
                      if (isMainTab()) {
                        navigateToTabWithUrl(
                          navigate,
                          HOME_PAGE_NAME,
                          HOME_PATH,
                        );
                      } else {
                        navigateToMainTab(navigate, HOME_PAGE_NAME, HOME_PATH);
                      }
                    }}
                  >
                    콘텐츠 구경하기
                  </MakeScrapButton>
                </ProifileNotClipWrap>
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
  min-height: calc(
    100dvh -
      ${theme.systemSize.bottomNavBar.heightNum +
        theme.systemSize.bottomNavBar.heightNum +
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--safe-area-inset-top',
          ),
        ) || 0}px
  );
`;

const ProifileNotClipTitleWrap = styled.div`
  display: flex;
`;

const ProifileNotClipWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ProifileNotClipIconWrap = styled.div`
  display: flex;
  margin: 0 auto;
`;

const ProifileNotClipTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body5};
  white-space: nowrap;
  display: flex;
  margin: 0 auto;
`;
const MakeScrapButton = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  font-size: 13px;
  margin: 10px auto 0px auto;
  background-color: ${theme.mainColor.Black};
  color: white;
  padding: 10px;
  border-radius: 25px;
  cursor: pointer;
`;

export default ProfileClipListBody;
