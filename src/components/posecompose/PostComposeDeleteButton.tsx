import React from 'react';
import styled from 'styled-components';

import { ReactComponent as PostComposeDeleteButtonIcon } from 'assets/images/icon/svg/PostComposeDeleteButtonIcon.svg';

interface PostComposeDeleteButtonProps {
  actionFunc: () => void;
}

const PostComposeDeleteButton: React.FC<PostComposeDeleteButtonProps> = ({
  actionFunc,
}) => {
  return (
    <>
      <PostComposeDeleteButtonWrap onClick={actionFunc}>
        <PostComposeDeleteIconButton>
          <PostComposeDeleteSubButton>
            <PostComposeDeleteButtonIcon />
          </PostComposeDeleteSubButton>
        </PostComposeDeleteIconButton>
      </PostComposeDeleteButtonWrap>
    </>
  );
};

const PostComposeDeleteButtonWrap = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 8px;
  cursor: pointer;
`;
const PostComposeDeleteIconButton = styled.div`
  background-color: black;
  display: flex;
  border-radius: 50%;
  height: 25px;
  width: 25px;
`;

const PostComposeDeleteSubButton = styled.div`
  display: flex;
  margin: auto;
`;

export default PostComposeDeleteButton;
