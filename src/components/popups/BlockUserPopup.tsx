import React from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { createBlockUser } from '../../services/profile/createBlockUser';
import { deleteBlockUser } from '../../services/profile/deleteBlockUser';
import { isActiveProfileBlockPopupAtom } from '../../states/ProfileAtom';
import PopupLayout from '../layouts/PopupLayout';

const popupWrapStyle: React.CSSProperties = {
  height: '55%',
};

interface BlockUserPopupProps {
  userInfo: { username: string; userId: string };
  isBlocked: boolean;
  hasTransparentOverLay?: boolean;
  setIsBlocked?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettingPopup?: React.Dispatch<React.SetStateAction<boolean>>;
}
const BlockUserPopup: React.FC<BlockUserPopupProps> = ({
  userInfo,
  isBlocked,
  hasTransparentOverLay = false,
  setIsBlocked,
  setIsSettingPopup,
}) => {
  const setIsActiveProfileBlock = useSetRecoilState(
    isActiveProfileBlockPopupAtom,
  );

  const onClickAddBlockUser = () => {
    if (!isBlocked) {
      createBlockUser(userInfo.userId).then(() => {
        setIsActiveProfileBlock(false);
        if (setIsBlocked) {
          setIsBlocked(!isBlocked);
        }

        window.location.reload();
      });
    } else {
      deleteBlockUser(userInfo.userId).then(() => {
        setIsActiveProfileBlock(false);
        if (setIsBlocked) {
          setIsBlocked(!isBlocked);
        }
        window.location.reload();
      });
    }
    if (setIsSettingPopup) {
      setIsSettingPopup(false);
    }
  };

  return (
    <PopupLayout
      setIsPopup={setIsActiveProfileBlock}
      isTouchScrollBar={true}
      popupWrapStyle={popupWrapStyle}
      hasTransparentOverLay={hasTransparentOverLay}
      hasFixedActive={true}
    >
      {!isBlocked ? (
        <>
          <ProfileNameBlockWrap>
            <ProfileNameBlockTitle>
              @{userInfo.username}님을 차단하시나요?
            </ProfileNameBlockTitle>
          </ProfileNameBlockWrap>
          <ProfileBlockDescWrap>
            <ProfileBlockDescContent>
              {userInfo.username}님은 회원님의 프로필 또는 콘텐츠를 찾을 수 없게
              됩니다.
            </ProfileBlockDescContent>
            <ProfileBlockDescContent>
              차단을 해제하지 않는 한 아무도 해당 계정이 회원님의 게시물에 남긴
              답글을 볼 수 없게 됩니다.
            </ProfileBlockDescContent>
            <ProfileBlockDescContent>
              상대방에게 차단 되었다는 알림이 전송되지 않습니다.
            </ProfileBlockDescContent>
          </ProfileBlockDescWrap>
        </>
      ) : (
        <>
          <ProfileNameBlockWrap>
            <ProfileNameBlockTitle>
              @{userInfo.username}님을 차단 해제할까요?
            </ProfileNameBlockTitle>
          </ProfileNameBlockWrap>
          <ProfileBlockDescWrap>
            <ProfileBlockDescContent>
              {userInfo.username}님이 나를 팔로우하고 내 게시물을 볼 수
              있습니다.
            </ProfileBlockDescContent>
          </ProfileBlockDescWrap>
        </>
      )}
      <ScrapMakeButtonWrap>
        <ScrapMakeButton onClick={onClickAddBlockUser}>
          {!isBlocked ? '차단하기' : '차단 해제'}
        </ScrapMakeButton>
      </ScrapMakeButtonWrap>
    </PopupLayout>
  );
};

const ProfileNameBlockWrap = styled.div`
  padding: 50px 0 28px 0;
  display: flex;
  justify-content: center;
`;

const ProfileNameBlockTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline3};
`;

const ProfileBlockDescWrap = styled.div`
  display: flex;
  flex-flow: column;
  gap: 21px;
  justify-content: center;
  padding: 0 33px;
`;

const ProfileBlockDescContent = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  text-align: center;
`;

const ScrapMakeButtonWrap = styled.div`
  bottom: 45px;
  position: fixed;
  width: 100%;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
`;

const ScrapMakeButton = styled.div`
  margin: 0 20px;
  background-color: ${({ theme }) => theme.mainColor.Black};
  padding: 14px 0;
  text-align: center;
  color: ${({ theme }) => theme.mainColor.White};
  border-radius: 8px;
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  cursor: pointer;
`;

export default BlockUserPopup;
