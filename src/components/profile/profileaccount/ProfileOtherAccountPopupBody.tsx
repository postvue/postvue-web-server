import { ReactComponent as LinkButtonIcon } from 'assets/images/icon/svg/LinkButtonIcon.svg';
import {
  isApp,
  sendBasicShareEvent,
} from 'global/util/reactnative/nativeRouter';
import { handleShareUtil, ShareInfo } from 'global/util/ShareUtil';
import { onClickClipBoardCopyButton } from 'global/util/ToastUtil';
import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  activeProfileAccountComplaintPopupAtom,
  isActiveProfileBlockPopupAtom,
} from 'states/ProfileAtom';
import { sharePopupInfoAtom } from 'states/ShareAtom';
import styled from 'styled-components';

interface ProfileOtherAccountPopupBodyProps {
  userId: string;
  username: string;
  onClose: () => void;
}

const ProfileOtherAccountPopupBody: React.FC<
  ProfileOtherAccountPopupBodyProps
> = ({ userId, username, onClose }) => {
  const setIsActiveProfileBlockPopup = useSetRecoilState(
    isActiveProfileBlockPopupAtom,
  );
  const [shareSharePopupInfo, setSharePopupInfo] =
    useRecoilState(sharePopupInfoAtom);

  const setActiveProfileAccountComplaintPopup = useSetRecoilState(
    activeProfileAccountComplaintPopupAtom,
  );
  return (
    <SettingPopupContentWrap>
      <SettingPopupContent
        onClick={() => {
          onClose();
          onClickClipBoardCopyButton(window.location.href, <LinkButtonIcon />);
        }}
      >
        링크 복사
      </SettingPopupContent>
      <SettingPopupContent
        onClick={() => {
          onClose();
          // setSharePopupInfo({
          //   isActive: true,
          //   shareLink: window.location.href,
          //   mainImageUrl: shareSharePopupInfo.mainImageUrl,
          // });

          const shareInfo: ShareInfo = {
            text: '특별한 순간을 함께 눈으로 확인해 보실래요? ❤️',
            url: window.location.href,
          };
          if (isApp()) {
            sendBasicShareEvent(shareInfo);
          } else {
            handleShareUtil(shareInfo);
          }
        }}
      >
        프로필 공유
      </SettingPopupContent>
      <SettingPopupContent
        onClick={() => {
          onClose();
          setIsActiveProfileBlockPopup(true);
        }}
      >
        사용자 차단
      </SettingPopupContent>
      <SettingPopupContent
        onClick={() => {
          onClose();
          setActiveProfileAccountComplaintPopup({
            isActive: true,
            userId: userId,
            username: username,
          });
        }}
      >
        사용자 신고
      </SettingPopupContent>
    </SettingPopupContentWrap>
  );
};

const SettingPopupContentWrap = styled.div`
  padding-left: 20px;
  display: flex;
  gap: 34px;
  flex-flow: column;
  // width: 100%;
`;
const SettingPopupContent = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  cursor: pointer;
`;
export default ProfileOtherAccountPopupBody;
