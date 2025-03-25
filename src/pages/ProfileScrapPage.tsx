import { queryClient } from 'App';
import PageHelmentInfoElement from 'components/PageHelmetInfoElement';
import PullToRefreshComponent from 'components/PullToRefreshComponent';
import { APP_SERVICE_NAME } from 'const/AppInfoConst';
import { INIT_CURSOR_ID } from 'const/PageConfigConst';
import { POST_VIDEO_TYPE } from 'const/PostContentTypeConst';
import { QUERY_STATE_PROFILE_SCRAP } from 'const/QueryClientConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { getRandomImage } from 'global/util/ShareUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import {
  QueryStateProfileScrap,
  QueryStateProfileScrapInterface,
} from 'hook/queryhook/QueryStateProfileScrap';
import { QueryStateProfileScrapInfo } from 'hook/queryhook/QueryStateProfileScrapInfo';
import React from 'react';
import { useParams } from 'react-router-dom';
import { getProfileScrap } from 'services/profile/getProfileScrap';
import styled from 'styled-components';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import ProfileScrapBody from '../components/profile/ProfileScrapBody';
import ProfileScrapHeader from '../components/profile/ProfileScrapHeader';
const ProfileScrapPage: React.FC = () => {
  const param = useParams();
  const scrapId = param.scrap_id || '';
  const { windowWidth } = useWindowSize();
  const { refetch: refetchByProfileScrapInfo, data: profileScrapInfo } =
    QueryStateProfileScrapInfo(scrapId);

  const { data: profileScrap } = QueryStateProfileScrap(scrapId);

  return (
    <>
      {profileScrapInfo && profileScrap && (
        <PageHelmentInfoElement
          title={profileScrapInfo.scrapName}
          ogTitle={profileScrapInfo.scrapName}
          ogImage={getRandomImage(
            profileScrap.pages
              .flatMap((v) => v.snsPostRspList)
              .map((v) => v.postContents)
              .flatMap((v) => v)

              .map((v) => {
                if (v.postContentType === POST_VIDEO_TYPE) {
                  return v.previewImg;
                } else {
                  return v.content;
                }
              }),
            profileScrapInfo.profilePath,
          )}
          ogUrl={window.location.href}
          ogDescription={`안녕하세요 ${APP_SERVICE_NAME} 입니다.`}
        />
      )}

      <AppBaseTemplate>
        <ProfileScrapContainer>
          <ProfileScrapHeader />
          {windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
            <ProfileScrapBody scrapId={scrapId} />
          ) : (
            <PullToRefreshComponent
              onRefresh={async () => {
                refetchByProfileScrapInfo();

                const fetchData = await getProfileScrap(
                  INIT_CURSOR_ID,
                  scrapId,
                );

                const data: QueryStateProfileScrapInterface = {
                  pageParams: [INIT_CURSOR_ID],
                  pages: [{ ...fetchData }],
                };

                queryClient.setQueryData(
                  [QUERY_STATE_PROFILE_SCRAP, scrapId],
                  data,
                );
              }}
            >
              <ProfileScrapBody scrapId={scrapId} />
            </PullToRefreshComponent>
          )}
        </ProfileScrapContainer>
      </AppBaseTemplate>
    </>
  );
};

const ProfileScrapContainer = styled.div``;

export default ProfileScrapPage;
