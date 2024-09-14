import { ReactComponent as AccountShareButtonIcon } from 'assets/images/icon/svg/AccountShareButtonIcon.svg';
import { handleShareUtil } from 'global/util/shareUtil';
import React from 'react';
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
  return (
    <ShareButtonWrap
      onClick={() =>
        handleShareUtil({
          url: url,
          text: text,
          title: title,
        })
      }
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
