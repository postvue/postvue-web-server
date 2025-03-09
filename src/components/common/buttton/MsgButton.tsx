import { ReactComponent as PostReactionMsgButtonIcon } from 'assets/images/icon/svg/post/PostReactionMsgButtonIcon.svg';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import {
  isPostReactionAtom,
  reactionPostIdAtom,
} from '../../../states/PostReactionAtom';
import ReactionLongPressButtonTemplate from '../posts/body/ReactionLongPressButtonTemplate';

interface MsgButtonProps {
  postId: string;
  onClickFunc?: () => void;
}

const MsgButton: React.FC<MsgButtonProps> = ({ postId, onClickFunc }) => {
  const setReactionPostId = useSetRecoilState(reactionPostIdAtom);
  const setIsPopupActive = useSetRecoilState(isPostReactionAtom);

  return (
    <ReactionLongPressButtonTemplate resize={0.85} resizeSpeedRate={0.2}>
      <MsgButtonWrap
        onClick={(e) => {
          setReactionPostId(postId);
          setIsPopupActive(true);
          if (onClickFunc) {
            onClickFunc();
          }
          e.stopPropagation();
        }}
      >
        <PostReactionMsgButtonIcon />
      </MsgButtonWrap>
    </ReactionLongPressButtonTemplate>
  );
};

const MsgButtonWrap = styled.div`
  cursor: pointer;
  display: flex;
`;

export default MsgButton;
