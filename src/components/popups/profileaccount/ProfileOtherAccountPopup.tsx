import PopupLayout from 'components/layouts/PopupLayout';
import { CLIP_BOARD_COPY_TEXT } from 'const/SystemPhraseConst';
import { copyClipBoard } from 'global/util/CopyUtil';
import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  isActiveProfileAccountPopupAtom,
  isActiveProfileBlockPopupAtom,
} from 'states/ProfileAtom';
import { isSharePopupAtom } from 'states/ShareAtom';
import styled from 'styled-components';
import { notify } from '../ToastMsgPopup';

const ProfileOtherAccountPopup: React.FC = () => {
  const [isActiveProfileAccountPopup, setIsActiveProfileAccountPopup] =
    useRecoilState(isActiveProfileAccountPopupAtom);

  const setIsActiveProfileBlockPopup = useSetRecoilState(
    isActiveProfileBlockPopupAtom,
  );
  const setIsSharePopup = useSetRecoilState(isSharePopupAtom);

  async function onClickClipBoardCopyButton(copyText: string) {
    try {
      copyClipBoard(copyText);

      notify(CLIP_BOARD_COPY_TEXT);
    } catch (e) {
      alert(e);
    }
  }
  return (
    <PopupLayout
      setIsPopup={setIsActiveProfileAccountPopup}
      popupWrapStyle={{ height: 'auto' }}
    >
      <SettingPopupWrap
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
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
              setIsSharePopup(true);
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
      </SettingPopupWrap>
    </PopupLayout>
  );
};

const SettingPopupWrap = styled.div`
  bottom: 0;
  height: auto;

  margin-top: 50px;
  padding-bottom: 100px;
  width: 100%;
  background: white;
  border-radius: 15px 15px 0 0;
  z-index: 10;
`;

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

export default ProfileOtherAccountPopup;
