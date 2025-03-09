import { ReactComponent as PostScrapButtonWhiteIcon } from 'assets/images/icon/svg/post/PostClipButton20x20WhiteIcon.svg';
import { notify } from 'components/popups/ToastMsgPopup';
import { PROFILE_SCRAP_LIST_PATH } from 'const/PathConst';
import {
  POST_CONTENT_TYPE,
  POST_CONTENT_URL,
  POST_ID_QUERY_PARAM,
} from 'const/QueryParamConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { CREATE_SCRAP } from 'const/SystemPhraseConst';
import { stackRouterBack } from 'global/util/reactnative/nativeRouter';
import useBodyAdaptProps from 'hook/customhook/useBodyAdaptProps';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import ProfileMakeScrapBody from '../components/profile/ProfileMakeScrapBody';
import ProfileMakeScrapHeader from '../components/profile/ProfileMakeScrapHeader';
const MakeScrapPage: React.FC = () => {
  useBodyAdaptProps([
    { key: 'overscroll-behavior', value: 'none' },
    { key: 'overflow', value: 'hidden' },
  ]);
  const [serchParams] = useSearchParams();

  const postId = serchParams.get(POST_ID_QUERY_PARAM);
  const postContentUrl = serchParams.get(POST_CONTENT_URL);
  const postContentType = serchParams.get(POST_CONTENT_TYPE);

  const navigate = useNavigate();

  const { windowWidth } = useWindowSize();
  useEffect(() => {
    if (windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM) return;
    navigate(-1);
  }, []);
  return (
    <AppBaseTemplate isAppInsetTopMargin={false}>
      {/* <BodyFixScrollElement /> */}
      <ProfileMakeScrapHeader />
      <ProfileMakeScrapBody
        postId={postId}
        postContentType={postContentType}
        postContentUrl={postContentUrl}
        actionByApp={() => stackRouterBack(navigate)}
        actionByWeb={() => {
          navigate(PROFILE_SCRAP_LIST_PATH);

          notify({
            msgIcon: <PostScrapButtonWhiteIcon />,
            msgTitle: CREATE_SCRAP,
          });
        }}
      />
    </AppBaseTemplate>
  );
};

export default MakeScrapPage;
