import React from 'react';
import styled from 'styled-components';

import { ReactComponent as ProfilePostShareButtonIcon } from 'assets/images/icon/svg/profilepost/ProfilePostShareButtonIcon.svg';
import { useSetRecoilState } from 'recoil';
import { isSharePopupAtom } from 'states/ShareAtom';
import LongPressToResizeButton from './LongPressToResizeButton';

const ShareButton: React.FC = () => {
  const setIsSharePopup = useSetRecoilState(isSharePopupAtom);
  return (
    <LongPressToResizeButton resize={0.85} resizeSpeedRate={0.2}>
      <ShareButtonWrap
        onClick={(e) => {
          e.stopPropagation();
          setIsSharePopup(true);
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
`;

export default ShareButton;
