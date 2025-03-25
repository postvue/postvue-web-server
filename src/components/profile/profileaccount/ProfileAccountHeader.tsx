import AccountOtherSettingButton from 'components/common/buttton/AccountOtherSettingButton';
import AccountSettingButton from 'components/common/buttton/AccountSettingButton';
import SearchTabComponent from 'components/home/header/SearchTabComponent';
import {
  STATUS_BAD_REQUEST_CODE,
  STATUS_NOT_FOUND_CODE,
} from 'const/HttpStatusConst';
import { HOME_PATH } from 'const/PathConst';
import { useGoBackOrNavigate } from 'global/util/HistoryStateUtil';
import { QueryStateProfileInfo } from 'hook/queryhook/QueryStateProfileInfo';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import PrevButtonHeaderHeader from '../../layouts/PrevButtonHeaderHeader';

interface ProfileAccountHeaderProps {
  username: string;
  isPrevButton?: boolean;
  prevButton?: React.ReactNode;
  HeaderLayoutStyle?: React.CSSProperties;
}

const ProfileAccountHeader: React.FC<ProfileAccountHeaderProps> = ({
  username,
  isPrevButton = true,
  prevButton,
  HeaderLayoutStyle,
}) => {
  const goBackOrNavigate = useGoBackOrNavigate(HOME_PATH);

  const { data, isLoading, error, isError } = QueryStateProfileInfo(username);

  useEffect(() => {
    if (isError) {
      if (error.status === STATUS_NOT_FOUND_CODE) {
        alert('해당 계정은 없습니다.');
        goBackOrNavigate();
      }
      if (error.status === STATUS_BAD_REQUEST_CODE) {
        goBackOrNavigate();
      }
    }
  }, [isError]);
  return (
    <>
      {!isLoading && username !== '' && data && (
        <PrevButtonHeaderHeader
          titleName={data.username}
          isActionFunc={!isPrevButton}
          preNodeByState={prevButton}
          HeaderLayoutStyle={HeaderLayoutStyle}
          RightButtonNode={
            <ProfileSettingWrap>
              <SearchTabComponent />
              {data.isMe ? (
                <AccountSettingButton />
              ) : (
                <AccountOtherSettingButton
                  userId={data.userId}
                  username={data.username}
                />
              )}
            </ProfileSettingWrap>
          }
        />
      )}
    </>
  );
};

const ProfileSettingWrap = styled.div`
  display: flex;
  cursor: pointer;
  position: relative;
  gap: 15px;
`;

export default ProfileAccountHeader;
