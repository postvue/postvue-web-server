import { ReactComponent as PostComposeButtonIcon } from 'assets/images/icon/svg/post/PostComposeButtonIcon.svg';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { isActivPostComposePopupAtom } from 'states/PostComposeAtom';
import styled from 'styled-components';

const PostComposeButton: React.FC = () => {
  const setIsActivePostComposePopup = useSetRecoilState(
    isActivPostComposePopupAtom,
  );
  return (
    <PostComposeButtonContainer
      onClick={(e) => {
        e.stopPropagation();
        setIsActivePostComposePopup(true);
      }}
    >
      <PostWritingButtonWrap>
        <PostComposeButtonIcon />
      </PostWritingButtonWrap>
    </PostComposeButtonContainer>
  );
};

const PostComposeButtonContainer = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${({ theme }) => theme.mainColor.Blue};
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
