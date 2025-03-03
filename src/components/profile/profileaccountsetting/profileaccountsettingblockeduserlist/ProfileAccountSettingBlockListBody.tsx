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
                if (v.blockedUsername.startsWith(blockSearchInput)) {
                  return (
                    <ProfileSettingBlockUserWrap key={key}>
                      <ProfileSettingBlockUserInfoWrap>
                        <ProfileSettingBlockUserProfileImg
                          src={
                            v.blockedUserProfilePath ||
                            ACCOUNT_NOT_PROFILE_IMG_PATH
                          }
                        />
                        <ProfileSettingNameWrap>
                          <div>
                            <ProfileSettingBlockNickname>
                              {v.blockedNickname}
                            </ProfileSettingBlockNickname>
                            <ProfileSettingBlockUsername>
                              @{v.blockedUsername}
                            </ProfileSettingBlockUsername>
                          </div>
                        </ProfileSettingNameWrap>
                      </ProfileSettingBlockUserInfoWrap>
                      <ProfileSettingBlockingButtonWrap>
                        <ProfileSettingBlockingButton
                          onClick={() => {
                            setBlockedUserInfo({
                              userId: v.blockedUserId,
                              username: v.blockedUsername,
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
          {profileBlockedUserList &&
            profileBlockedUserList.pages.flatMap((v) => v).length <= 0 && (
              <NotBlockedUserListTitleWrap>
                <NotBlockedUserListTitle>
                  차단 유저가 없습니다.
                </NotBlockedUserListTitle>
              </NotBlockedUserListTitleWrap>
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
        />
      )}
    </>
  );
};

const ProfileSettingBlockListBodyContainer = styled.div``;

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
  object-fit: cover;
`;

const ProfileSettingNameWrap = styled.div`
  margin: auto 0;
`;

const ProfileSettingBlockUsername = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey6};
`;

const ProfileSettingBlockNickname = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead2};

  color: ${({ theme }) => theme.grey.Grey8};
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const ProfileSettingBlockingButtonWrap = styled.div`
  margin: auto 0;
`;

const ProfileSettingBlockingButton = styled.div`
  color: ${({ theme }) => theme.mainColor.Blue};
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  cursor: pointer;
`;

const NotBlockedUserListTitleWrap = styled.div``;

const NotBlockedUserListTitle = styled.div`
  top: calc(50%);
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);

  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey6};
`;

export default ProfileAccountSettingBlockListBody;
