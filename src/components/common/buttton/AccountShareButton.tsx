import { ReactComponent as AccountShareButtonIcon } from 'assets/images/icon/svg/AccountShareButtonIcon.svg';
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
        setShareInfoPopup({
          isActive: true,
          shareLink: url,
          mainImageUrl: mainImageUrl,
          isFixed: true,
        });
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
