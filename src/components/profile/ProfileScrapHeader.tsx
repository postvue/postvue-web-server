import AccountShareButton from 'components/common/buttton/AccountShareButton';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import { POST_IMAGE_TYPE } from 'const/PostContentTypeConst';
import { getRandomImage } from 'global/util/shareUtil';
import { QueryStateProfileScrap } from 'hook/queryhook/QueryStateProfileScrap';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { profileScrapInfoAtom } from 'states/ProfileAtom';

const ProfileScrapHeader: React.FC = () => {
  const profileScrapInfo = useRecoilValue(profileScrapInfoAtom);

  const param = useParams();
  const scrapId = param.scrap_id;
  const { data: profileScrap, isFetched: isFetchedByProfileScrap } =
    QueryStateProfileScrap(scrapId || '');

  return (
    <PrevButtonHeaderHeader
      titleName=""
      RightButtonNode={
        <AccountShareButton
          url={window.location.href}
          text={profileScrapInfo.scrapName}
          mainImageUrl={getRandomImage(
            profileScrap?.pages
              .flatMap((value) => value.scrapPostList)
              .filter((v) => v.postThumbnailContentType === POST_IMAGE_TYPE)
              .map((v) => v.postThumbnailContent) || [],
            profileScrapInfo.profilePath,
          )}
        />
      }
    />
  );
};

export default ProfileScrapHeader;
