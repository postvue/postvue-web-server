import { queryClient } from 'App';
import { ReactComponent as PostScrapButtonWhiteIcon } from 'assets/images/icon/svg/post/PostClipButton20x20WhiteIcon.svg';
import { AxiosError } from 'axios';
import { notify } from 'components/popups/ToastMsgPopup';
import {
  QUERY_STATE_PROFILE_ACCOUNT_POST_LIST,
  QUERY_STATE_PROFILE_SCRAP_INFO,
} from 'const/QueryClientConst';
import { TargetAudienceCategory, targetAudienceList } from 'const/ScrapConst';
import { fetchProfileScrapListInfinite } from 'global/util/channel/static/fetchProfileScrapListInfinite';
import { fetchScrapInfo } from 'global/util/channel/static/fetchScrapInfo';
import { isApp } from 'global/util/reactnative/nativeRouter';
import { QueryStateProfileScrapInfo } from 'hook/queryhook/QueryStateProfileScrapInfo';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { putEditProfileScrap } from 'services/profile/putEditProfileScrap';
import { scrapTargetAudienceAtom } from 'states/ProfileAtom';
import {
  POST_CONTENT_TYPE,
  POST_CONTENT_URL,
  POST_ID_QUERY_PARAM,
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
  const { data: profileScrapInfo, isFetched } = QueryStateProfileScrapInfo(
    scrapId || '',
  );

  const [scrapTargetAudience, setScrapTargetAudience] = useRecoilState(
    scrapTargetAudienceAtom,
  );

  const [scrapName, setScrapName] = useState<string>('');

  const [serchParams] = useSearchParams();

  const postId = serchParams.get(POST_ID_QUERY_PARAM);
  const postContentUrl = serchParams.get(POST_CONTENT_URL);
  const postContentType = serchParams.get(POST_CONTENT_TYPE);

  const onClickEditScrap = () => {
    if (!scrapId) return;
    if (isValidString(scrapName) && scrapTargetAudience.targetAudienceValue) {
      putEditProfileScrap(scrapId, {
        scrapName: scrapName,
        targetAudienceValue: scrapTargetAudience.targetAudienceValue,
      })
        .then(async (value) => {
          await queryClient.invalidateQueries({
            queryKey: [QUERY_STATE_PROFILE_ACCOUNT_POST_LIST],
          });

          if (isApp()) {
            fetchScrapInfo(scrapId);
            fetchProfileScrapListInfinite();

            notify({
              msgIcon: <PostScrapButtonWhiteIcon />,
              msgTitle: UPDATE_SCRAP,
            });
          } else {
            queryClient.invalidateQueries({
              queryKey: [QUERY_STATE_PROFILE_SCRAP_INFO, scrapId],
            });

            notify({
              msgIcon: <PostScrapButtonWhiteIcon />,
              msgTitle: UPDATE_SCRAP,
            });
          }
        })
        .catch((error: AxiosError) => {
          const data: any = error.response?.data;
          alert(data.message);
        });
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
      isActive={
        isFetched
          ? (profileScrapInfo?.scrapName !== scrapName &&
              isValidString(scrapName)) ||
            (targetAudienceList.includes(scrapTargetAudience) &&
              profileScrapInfo?.targetAudience !==
                scrapTargetAudience.targetAudienceValue)
          : false
      }
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
