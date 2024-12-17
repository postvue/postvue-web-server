import { onClickClipBoardCopyButton } from 'global/util/ToastUtil';
import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  isActiveProfileAccountPopupAtom,
  isActiveProfileBlockPopupAtom,
} from 'states/ProfileAtom';
import { sharePopupInfoAtom } from 'states/ShareAtom';
import styled from 'styled-components';

const ProfileOtherAccountPopupBody: React.FC = () => {
  const setIsActiveProfileAccountPopup = useSetRecoilState(
    isActiveProfileAccountPopupAtom,
  );

  const setIsActiveProfileBlockPopup = useSetRecoilState(
    isActiveProfileBlockPopupAtom,
  );
  const [shareSharePopupInfo, setSharePopupInfo] =
    useRecoilState(sharePopupInfoAtom);
  return (
    <SettingPopupContentWrap>
      <SettingPopupContent
        onClick={() => {
          setIsActiveProfileAccountPopup(false);
          onClickClipBoardCopyButton(window.location.href);
        }}
      >
        링크 복사
      </SettingPopupContent>
      <SettingPopupContent
        onClick={() => {
          setIsActiveProfileAccountPopup(false);
          setSharePopupInfo({
            isActive: true,
            shareLink: window.location.href,
            mainImageUrl: shareSharePopupInfo.mainImageUrl,
          });
        }}
      >
        프로필 공유
      </SettingPopupContent>
      <SettingPopupContent
        onClick={() => {
          setIsActiveProfileAccountPopup(false);
          setIsActiveProfileBlockPopup(true);
        }}
      >
        사용자 차단
      </SettingPopupContent>
      <SettingPopupContent>사용자 신고</SettingPopupContent>
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
