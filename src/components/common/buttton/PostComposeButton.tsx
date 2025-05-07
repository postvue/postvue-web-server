import { ReactComponent as PostComposeNavIcon } from 'assets/images/icon/svg/navbar/PostComposeNavIconV2.svg';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { isActivPostComposeSelectPopupAtom } from 'states/PostComposeAtom';
import styled from 'styled-components';

const PostComposeButton: React.FC = () => {
  const setIsActivePostComposeSelectPopup = useSetRecoilState(
    isActivPostComposeSelectPopupAtom,
  );
  return (
    <PostComposeButtonContainer
      onClick={(e) => {
        e.stopPropagation();
        setIsActivePostComposeSelectPopup(true);
      }}
    >
      <PostWritingButtonWrap>
        <PostComposeNavIcon
          style={{ verticalAlign: 'bottom', display: 'flex' }}
        />
      </PostWritingButtonWrap>
    </PostComposeButtonContainer>
  );
};

const PostComposeButtonContainer = styled.div`
  width: 45px;
  height: 45px;
  // background-color: ${({ theme }) => theme.mainColor.Blue};
  border-radius: 30px;
  margin: auto auto;
  display: flex;
  cursor: pointer;
`;

const PostWritingButtonWrap = styled.div`
  margin: auto auto;
  display: flex;
`;

export default PostComposeButton;
