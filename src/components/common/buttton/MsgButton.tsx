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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M8 9H16M8 13H14M9 18H6C5.20435 18 4.44129 17.6839 3.87868 17.1213C3.31607 16.5587 3 15.7956 3 15V7C3 6.20435 3.31607 5.44129 3.87868 4.87868C4.44129 4.31607 5.20435 4 6 4H18C18.7956 4 19.5587 4.31607 20.1213 4.87868C20.6839 5.44129 21 6.20435 21 7V15C21 15.7956 20.6839 16.5587 20.1213 17.1213C19.5587 17.6839 18.7956 18 18 18H15L12 21L9 18Z"
            stroke="#535B63"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </MsgButtonWrap>
    </LongPressToResizeButton>
  );
};

const MsgButtonWrap = styled.div`
  cursor: pointer;
  display: flex;
`;

export default MsgButton;
