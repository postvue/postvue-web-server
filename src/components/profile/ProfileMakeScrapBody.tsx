import { ReactComponent as PostScrapButtonWhiteIcon } from 'assets/images/icon/svg/post/PostClipButton20x20WhiteIcon.svg';
import { AxiosError } from 'axios';
import { notify } from 'components/popups/ToastMsgPopup';
import { targetAudienceList } from 'const/ScrapConst';
import { fetchProfileScrapListInfinite } from 'global/util/channel/static/fetchProfileScrapListInfinite';
import { fetchScrapPreviewList } from 'global/util/channel/static/fetchScrapPreviewList';
import { refetchProfileScrapInfo } from 'global/util/channel/static/refetchProfileScrapListInfo';
import { isApp, stackRouterBack } from 'global/util/reactnative/nativeRouter';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { scrapTargetAudienceAtom } from 'states/ProfileAtom';
import { PROFILE_SCRAP_LIST_PATH } from '../../const/PathConst';
import {
  POST_CONTENT_TYPE,
  POST_CONTENT_URL,
  POST_ID_QUERY_PARAM,
} from '../../const/QueryParamConst';
import { CREATE_SCRAP } from '../../const/SystemPhraseConst';
import { isValidString } from '../../global/util/ValidUtil';
import { postProfileScrap } from '../../services/profile/postProfileScrap';
import ProfileComposeScrapBody from './ProfileComposeScrapBody';

const ProfileMakeScrapBody: React.FC = () => {
  const navigate = useNavigate();

  const scrapTargetAudience = useRecoilValue(scrapTargetAudienceAtom);

  const [scrapName, setScrapName] = useState<string>('');

  const [serchParams] = useSearchParams();

  const postId = serchParams.get(POST_ID_QUERY_PARAM);
  const postContentUrl = serchParams.get(POST_CONTENT_URL);
  const postContentType = serchParams.get(POST_CONTENT_TYPE);

  const onClickMakeScrap = () => {
    if (isValidString(scrapName) && scrapTargetAudience.targetAudienceValue) {
      postProfileScrap(
        {
          scrapName: scrapName,
          targetAudienceValue: scrapTargetAudience.targetAudienceValue,
        },
        postId !== null ? postId : '',
      )
        .then(() => {
          fetchProfileScrapListInfinite();
          refetchProfileScrapInfo();
          if (postId != null) {
            fetchScrapPreviewList(postId);
          }

          if (isApp()) {
            // @REFER: 일단 나중에 적용
            stackRouterBack(navigate);
          } else {
            navigate(PROFILE_SCRAP_LIST_PATH);

            notify({
              msgIcon: <PostScrapButtonWhiteIcon />,
              msgTitle: CREATE_SCRAP,
            });
          }
        })
        .catch((error: AxiosError) => {
          const data: any = error.response?.data;
          alert(data.message);
        });
    }
  };

  return (
    <ProfileComposeScrapBody
      buttonTitle={'신규 스크랩 만들기'}
      isActive={
        isValidString(scrapName) &&
        targetAudienceList.includes(scrapTargetAudience)
      }
      actionFunc={onClickMakeScrap}
      postId={postId || undefined}
      postContentType={postContentType || undefined}
      postContentUrl={postContentUrl || undefined}
      scrapName={scrapName}
      setScrapName={setScrapName}
    />
  );
};

export default ProfileMakeScrapBody;
