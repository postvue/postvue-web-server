import { ReactComponent as AccountShareButtonIcon } from 'assets/images/icon/svg/AccountShareButtonIcon.svg';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { isSharePopupAtom } from 'states/ShareAtom';
import styled from 'styled-components';

interface AccountShareButtonProps {
  url: string;
  text?: string;
  title?: string;
}

const AccountShareButton: React.FC<AccountShareButtonProps> = ({
  url,
  text,
  title,
}) => {
  const setIsSharePopup = useSetRecoilState(isSharePopupAtom);
  return (
    <ShareButtonWrap onClick={() => setIsSharePopup(true)}>
      <AccountShareButtonIcon />
    </ShareButtonWrap>
  );
};

const ShareButtonWrap = styled.div`
  display: flex;
  margin: auto 0px;
`;

export default AccountShareButton;
