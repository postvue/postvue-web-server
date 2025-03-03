import { ReactComponent as AccountShareButtonIcon } from 'assets/images/icon/svg/AccountShareButtonIcon.svg';
import {
  isApp,
  sendBasicShareEvent,
} from 'global/util/reactnative/nativeRouter';
import { handleShareUtil, ShareInfo } from 'global/util/ShareUtil';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { sharePopupInfoAtom } from 'states/ShareAtom';
import styled from 'styled-components';

interface AccountShareButtonProps {
  url: string;
  text?: string;
  title?: string;
  mainImageUrl: string;
}

const AccountShareButton: React.FC<AccountShareButtonProps> = ({
  url,
  text,
  title,
  mainImageUrl,
}) => {
  const setShareInfoPopup = useSetRecoilState(sharePopupInfoAtom);
  return (
    <ShareButtonWrap
      onClick={() => {
        // 나중에 수정 바람
        // setShareInfoPopup({
        //   isActive: true,
        //   shareLink: url,
        //   mainImageUrl: mainImageUrl,
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
      <AccountShareButtonIcon />
    </ShareButtonWrap>
  );
};

const ShareButtonWrap = styled.div`
  display: flex;
  margin: auto 0px;
`;

export default AccountShareButton;
