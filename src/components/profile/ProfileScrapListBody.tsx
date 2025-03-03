import { queryClient } from 'App';
import PullToRefreshComponent from 'components/PullToRefreshComponent';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_PROFILE_SCRAP_LIST } from 'const/QueryClientConst';
import { stackRouterPush } from 'global/util/reactnative/nativeRouter';
import { ProfileScrapListQueryInterface } from 'hook/queryhook/QueryStateProfileScrapList';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfileScrapList } from 'services/profile/getProfileScrapList';
import styled from 'styled-components';
import {
  PROFILE_NEW_SCRAP_PATH,
  PROFILE_SCRAP_LIST_PATH,
} from '../../const/PathConst';
import ProfileScrapViewBody from '../common/body/ProfileScrapViewBody';
import FloatingActionButtonLayout from '../layouts/FloatingActionButtonLayout';

const ProfileScrapListBody: React.FC = () => {
  const navigate = useNavigate();

  const MakeScrapScrollRef = useRef<HTMLDivElement>(null);

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
            profileScrapViewRef={MakeScrapScrollRef}
            onButtonEvent={({ scrapId, scrapName }) => {
              stackRouterPush(
                navigate,
                `${PROFILE_SCRAP_LIST_PATH}/${scrapId}`,
              );
            }}
          />
          <FloatingActionButtonLayout bottomGap={56}>
            <div
              onClick={() => stackRouterPush(navigate, PROFILE_NEW_SCRAP_PATH)}
            >
              <MakeScrapButton>
                <MakeScrapButtonIconWrap>
                  <MakeScrapButtonIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                  >
                    <path
                      d="M6.49992 0.958252V12.0416M0.958252 6.49992H12.0416"
                      stroke="#3D4248"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </MakeScrapButtonIcon>
                </MakeScrapButtonIconWrap>
                <MakeScrapButtonTitle>스크랩 추가하기</MakeScrapButtonTitle>
              </MakeScrapButton>
            </div>
          </FloatingActionButtonLayout>
        </ProfileScrapListBodyContainer>
      </PullToRefreshComponent>
    </ProfileScrapListContainer>
  );
};

const ProfileScrapListContainer = styled.div`
  padding-top: 20px;
`;

const ProfileScrapListBodyContainer = styled.div``;

const MakeScrapButton = styled.div`
  display: flex;
  gap: 6px;
`;

const MakeScrapButtonIconWrap = styled.div`
  display: flex;
`;

const MakeScrapButtonIcon = styled.svg`
  margin: auto 0;
`;

const MakeScrapButtonTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey8};
`;

export default ProfileScrapListBody;
