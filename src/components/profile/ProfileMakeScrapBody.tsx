import { queryClient } from 'App';
import { notify } from 'components/popups/ToastMsgPopup';
import { QUERY_STATE_PROFILE_ACCOUNT_POST_LIST } from 'const/QueryClientConst';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { scrapTargetAudienceAtom } from 'states/ProfileAtom';
import { PROFILE_SCRAP_LIST_PATH } from '../../const/PathConst';
import {
  POST_CONTENT_TYPE,
  POST_CONTENT_URL,
  POST_ID,
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

  const postId = serchParams.get(POST_ID);
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
      ).then(() => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_STATE_PROFILE_ACCOUNT_POST_LIST],
        });

        navigate(PROFILE_SCRAP_LIST_PATH);
      });

      notify(CREATE_SCRAP);
    }
  };

  return (
    <ProfileComposeScrapBody
      buttonTitle={'신규 스크랩 만들기'}
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
