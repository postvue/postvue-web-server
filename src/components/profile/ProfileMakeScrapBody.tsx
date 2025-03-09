import { AxiosError } from 'axios';
import { targetAudienceList } from 'const/ScrapConst';
import { fetchProfileScrapListInfinite } from 'global/util/channel/static/fetchProfileScrapListInfinite';
import { fetchScrapPreviewList } from 'global/util/channel/static/fetchScrapPreviewList';
import { refetchProfileScrapInfo } from 'global/util/channel/static/refetchProfileScrapListInfo';
import { isApp } from 'global/util/reactnative/nativeRouter';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { scrapTargetAudienceAtom } from 'states/ProfileAtom';
import { isValidString } from '../../global/util/ValidUtil';
import { postProfileScrap } from '../../services/profile/postProfileScrap';
import ProfileComposeScrapBody from './ProfileComposeScrapBody';

interface ProfileMakeScrapBodyProps {
  postId: string | null;
  postContentUrl: string | null;
  postContentType: string | null;
  actionByApp: () => void;
  actionByWeb: () => void;
  ProfileMakeScrapBodyContainerStyle?: React.CSSProperties;
  BottomNextButtonWrapContainerStyle?: React.CSSProperties;
  isInsetTop?: boolean;
}

const ProfileMakeScrapBody: React.FC<ProfileMakeScrapBodyProps> = ({
  postId,
  postContentType,
  postContentUrl,
  actionByApp,
  actionByWeb,
  ProfileMakeScrapBodyContainerStyle,
  BottomNextButtonWrapContainerStyle,
  isInsetTop,
}) => {
  const navigate = useNavigate();

  const scrapTargetAudience = useRecoilValue(scrapTargetAudienceAtom);

  const [scrapName, setScrapName] = useState<string>('');

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
            actionByApp();
          } else {
            actionByWeb();
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
      ProfileMakeScrapBodyContainerStyle={ProfileMakeScrapBodyContainerStyle}
      BottomNextButtonWrapContainerStyle={BottomNextButtonWrapContainerStyle}
      isInsetTop={isInsetTop}
    />
  );
};

export default ProfileMakeScrapBody;
