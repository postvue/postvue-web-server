import BlockUserPopup from 'components/popups/BlockUserPopup';
import { ACCOUNT_NOT_PROFILE_IMG_PATH } from 'const/AccountConst';
import ProfileBlockedUserListInfiniteScroll from 'hook/ProfileBlockedUserListInfiniteScroll';
import { QueryStateProfileBlockedUserList } from 'hook/queryhook/QueryStateProfileBlockedUserList';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { isActiveProfileBlockPopupAtom } from 'states/ProfileAtom';
import styled from 'styled-components';
import { SETTING_PFOFILE_BLOCKED_LIST_SEARCH_INPUT_PHASE_TEXT } from '../../../../const/SystemPhraseConst';
import SearchButtonInput from '../../../common/input/SearchButtonInput';

const ProfileAccountSettingBlockListBody: React.FC = () => {
  const [blockSearchInput, setBlockSearchInput] = useState<string>('');

  const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBlockSearchInput(event.target.value);
  };

  const onSearchInputDelete = () => {
    setBlockSearchInput('');
  };

  const { data: profileBlockedUserList } = QueryStateProfileBlockedUserList();

  const [isActiveProfileBlockPopup, setIsActiveProfileBlockPopup] =
    useRecoilState(isActiveProfileBlockPopupAtom);

  const [blckedUserInfo, setBlockedUserInfo] = useState<{
    username: string;
    userId: string;
  }>({ username: '', userId: '' });

  return (
    <>
      <ProfileSettingBlockListBodyContainer>
        <ProfileBlockedUserSearchContainer>
          <SearchButtonInput
            placeholder={SETTING_PFOFILE_BLOCKED_LIST_SEARCH_INPUT_PHASE_TEXT}
            onSearchInputChange={onSearchInputChange}
            onClickDelete={onSearchInputDelete}
            value={blockSearchInput}
            isActiveDeleteButton={blockSearchInput !== ''}
          />
        </ProfileBlockedUserSearchContainer>
        <ProfileSettingBlockUserListContainer>
          {profileBlockedUserList &&
            profileBlockedUserList.pages.flatMap((value) =>
              value.map((v, key) => {
                if (v.blockedUserName.startsWith(blockSearchInput)) {
                  return (
                    <ProfileSettingBlockUserWrap key={key}>
                      <ProfileSettingBlockUserInfoWrap>
                        <ProfileSettingBlockUserProfileImg
                          src={
                            v.blockedUserProfilePath ||
                            ACCOUNT_NOT_PROFILE_IMG_PATH
                          }
                        />
                        <ProfileSettingBlockUserName>
                          {v.blockedUserName}
                        </ProfileSettingBlockUserName>
                      </ProfileSettingBlockUserInfoWrap>
                      <ProfileSettingBlockingButtonWrap>
                        <ProfileSettingBlockingButton
                          onClick={() => {
                            setBlockedUserInfo({
                              userId: v.blockedUserId,
                              username: v.blockedUserName,
                            });
                            setIsActiveProfileBlockPopup(true);
                          }}
                        >
                          해제
                        </ProfileSettingBlockingButton>
                      </ProfileSettingBlockingButtonWrap>
                    </ProfileSettingBlockUserWrap>
                  );
                }
              }),
            )}
        </ProfileSettingBlockUserListContainer>
        <ProfileBlockedUserListInfiniteScroll />
      </ProfileSettingBlockListBodyContainer>
      {isActiveProfileBlockPopup && (
        <BlockUserPopup
          userInfo={{
            username: blckedUserInfo.username,
            userId: blckedUserInfo.userId,
          }}
          isBlocked={true}
        />
      )}
    </>
  );
};

const ProfileSettingBlockListBodyContainer = styled.div`
  margin-top: ${({ theme }) => theme.systemSize.header.height};
`;

const ProfileBlockedUserSearchContainer = styled.div`
  padding: 16px 15px 16px 15px;
`;

const ProfileSettingBlockUserListContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: 10px;
`;

const ProfileSettingBlockUserWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
`;

const ProfileSettingBlockUserInfoWrap = styled.div`
  display: flex;
  gap: 11px;
`;

const ProfileSettingBlockUserProfileImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 30px;
`;

const ProfileSettingBlockUserName = styled.div`
  margin: auto 0;
  font: ${({ theme }) => theme.fontSizes.Subhead2};
`;

const ProfileSettingBlockingButtonWrap = styled.div`
  margin: auto 0;
`;

const ProfileSettingBlockingButton = styled.div`
  color: ${({ theme }) => theme.mainColor.Blue};
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  cursor: pointer;
`;

export default ProfileAccountSettingBlockListBody;
