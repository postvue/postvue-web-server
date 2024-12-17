import React from 'react';
import styled from 'styled-components';

import { ReactComponent as ProfilePostShareButtonIcon } from 'assets/images/icon/svg/post/ProfilePostShareButtonIcon.svg';
import { useSetRecoilState } from 'recoil';
import { sharePopupInfoAtom } from 'states/ShareAtom';
import LongPressToResizeButton from './LongPressToResizeButton';

interface ShareButtonProps {
  shareLink: string;
  mainImageUrl: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  shareLink,
  mainImageUrl,
}) => {
  const setSharePopupInfo = useSetRecoilState(sharePopupInfoAtom);
  return (
    <LongPressToResizeButton
      resize={0.85}
      resizeSpeedRate={0.2}
      LongPressToResizeButtonContainerStyle={{ display: 'flex' }}
    >
      <ShareButtonWrap
        onClick={(e) => {
          e.stopPropagation();
          setSharePopupInfo({
            isActive: true,
            shareLink: shareLink,
            mainImageUrl: mainImageUrl,
          });
        }}
      >
        <ProfilePostShareButtonIcon />
      </ShareButtonWrap>
    </LongPressToResizeButton>
  );
};

const ShareButtonWrap = styled.div`
  display: flex;
  margin: auto 0;
  cursor: pointer;
`;

export default ShareButton;
