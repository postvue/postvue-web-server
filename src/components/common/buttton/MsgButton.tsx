import { ReactComponent as PostReactionMsgButtonIcon } from 'assets/images/icon/svg/post/PostReactionMsgButtonIcon.svg';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import {
  isPostReactionAtom,
  reactionPostIdAtom,
} from '../../../states/PostReactionAtom';
import LongPressToResizeButton from './LongPressToResizeButton';

interface MsgButtonProps {
  postId: string;
}

const MsgButton: React.FC<MsgButtonProps> = ({ postId }) => {
  const setReactionPostId = useSetRecoilState(reactionPostIdAtom);
  const setIsPopupActive = useSetRecoilState(isPostReactionAtom);

  return (
    <LongPressToResizeButton resize={0.85} resizeSpeedRate={0.2}>
      <MsgButtonWrap
        onClick={(e) => {
          setReactionPostId(postId);
          setIsPopupActive(true);
          e.stopPropagation();
        }}
      >
        <PostReactionMsgButtonIcon />
      </MsgButtonWrap>
    </LongPressToResizeButton>
  );
};

const MsgButtonWrap = styled.div`
  cursor: pointer;
  display: flex;
`;

export default MsgButton;
