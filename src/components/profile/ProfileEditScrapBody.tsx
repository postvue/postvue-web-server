import { queryClient } from 'App';
import { notify } from 'components/popups/ToastMsgPopup';
import { QUERY_STATE_PROFILE_ACCOUNT_POST_LIST } from 'const/QueryClientConst';
import { TargetAudienceCategory } from 'const/ScrapConst';
import { QueryStateProfileScrapInfo } from 'hook/queryhook/QueryStateProfileScrapInfo';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { putEditProfileScrap } from 'services/profile/putEditProfileScrap';
import { scrapTargetAudienceAtom } from 'states/ProfileAtom';
import { PROFILE_SCRAP_LIST_PATH } from '../../const/PathConst';
import {
  POST_CONTENT_TYPE,
  POST_CONTENT_URL,
  POST_ID,
} from '../../const/QueryParamConst';
import { UPDATE_SCRAP } from '../../const/SystemPhraseConst';
import { isValidString } from '../../global/util/ValidUtil';
import ProfileComposeScrapBody from './ProfileComposeScrapBody';

interface ProfileEditScrapBodyProps {
  scrapId: string;
}

const ProfileEditScrapBody: React.FC<ProfileEditScrapBodyProps> = ({
  scrapId,
}) => {
  const navigate = useNavigate();

  const { data: profileScrapInfo, isFetched } = QueryStateProfileScrapInfo(
    scrapId || '',
  );

  const [scrapTargetAudience, setScrapTargetAudience] = useRecoilState(
    scrapTargetAudienceAtom,
  );

  const [scrapName, setScrapName] = useState<string>('');

  const [serchParams] = useSearchParams();

  const postId = serchParams.get(POST_ID);
  const postContentUrl = serchParams.get(POST_CONTENT_URL);
  const postContentType = serchParams.get(POST_CONTENT_TYPE);

  const onClickEditScrap = () => {
    if (!scrapId) return;
    if (isValidString(scrapName) && scrapTargetAudience.targetAudienceValue) {
      putEditProfileScrap(scrapId, {
        scrapName: scrapName,
        targetAudienceValue: scrapTargetAudience.targetAudienceValue,
      }).then(() => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_STATE_PROFILE_ACCOUNT_POST_LIST],
        });

        navigate(`${PROFILE_SCRAP_LIST_PATH}/${scrapId}`);
      });

      notify(UPDATE_SCRAP);
    }
  };

  useEffect(() => {
    if (!isFetched || !profileScrapInfo?.scrapName) return;
    setScrapName(profileScrapInfo.scrapName);

    setScrapTargetAudience(
      profileScrapInfo.targetAudience ===
        TargetAudienceCategory.PUBLIC_TARGET_AUDIENCE.targetAudienceValue
        ? TargetAudienceCategory.PUBLIC_TARGET_AUDIENCE
        : profileScrapInfo.targetAudience ===
            TargetAudienceCategory.PROTECTED_TARGET_AUDIENCE.targetAudienceValue
          ? TargetAudienceCategory.PROTECTED_TARGET_AUDIENCE
          : TargetAudienceCategory.PRIVATE_TARGET_AUDIENCE,
    );

    TargetAudienceCategory.PUBLIC_TARGET_AUDIENCE;
  }, [isFetched]);

  return (
    <ProfileComposeScrapBody
      buttonTitle={'스크랩 수정하기'}
      actionFunc={onClickEditScrap}
      postId={postId || undefined}
      postContentType={postContentType || undefined}
      postContentUrl={postContentUrl || undefined}
      scrapName={scrapName}
      setScrapName={setScrapName}
    />
  );
};

export default ProfileEditScrapBody;
