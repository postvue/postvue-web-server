import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import ProfileFollowListBody from 'components/profile/followlist/ProfileFollowListBody';
import ProfileFollowListHeader from 'components/profile/followlist/ProfileFollowListHeader';
import { HOME_PATH } from 'const/PathConst';
import { useGoBackOrNavigate } from 'global/util/HistoryStateUtil';
import { isValidString } from 'global/util/ValidUtil';
import { QueryStateProfileInfo } from 'hook/queryhook/QueryStateProfileInfo';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProfileFollowListPage: React.FC = () => {
  const params = useParams();
  const username = params.username || '';
  const { isFetched, isError } = QueryStateProfileInfo(username);

  const goBackOrNavigate = useGoBackOrNavigate(HOME_PATH);

  useEffect(() => {
    if (!isError) return;

    goBackOrNavigate();
  }, [isError]);
  return (
    <AppBaseTemplate>
      {isValidString(username) && isFetched && (
        <>
          <ProfileFollowListHeader />
          <ProfileFollowListBody username={username} />
        </>
      )}
    </AppBaseTemplate>
  );
};

export default ProfileFollowListPage;
