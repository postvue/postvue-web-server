import anime from 'animejs';
import React, { useRef } from 'react';
import styled from 'styled-components';
import { PostLikeRsp } from '../../../../global/interface/post';
import { putPostLike } from '../../../../services/post/putPostLike';
import LongPressToResizeButton from '../LongPressToResizeButton';

import { ReactComponent as PostReactionHeartButtonIcon } from 'assets/images/icon/svg/post/PostReactionHeartButtonIcon.svg';
import { ReactComponent as PostReactionHeartNotActiveButtonIcon } from 'assets/images/icon/svg/post/PostReactionHeartNotActiveButtonIcon.svg';
interface HeartButtonProps {
  setHeartStete: (postLikeGrp: PostLikeRsp) => void;
  postId: string;
  isLiked: boolean;
}

const HeartButton: React.FC<HeartButtonProps> = ({
  setHeartStete,
  postId,
  isLiked,
}) => {
  const heartRef = useRef(null);

  const onClickHeartButton = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (postId) {
      putPostLike(postId)
        .then((value) => {
          setHeartStete(value);

          if (value.isLike) {
            anime({
              targets: heartRef.current,
              scale: [1, 1.5],
              duration: 300,
              easing: 'easeInOutQuad',
              direction: 'alternate',
            });
          }
        })
        .catch((err) => {
          throw err;
        });
    }
  };
  return (
    <LongPressToResizeButton resize={0.85} resizeSpeedRate={0.2}>
      <HeartButtonWrap onClick={(e) => onClickHeartButton(e)} ref={heartRef}>
        {isLiked ? (
          <PostReactionHeartButtonIcon />
        ) : (
          <PostReactionHeartNotActiveButtonIcon />
        )}
      </HeartButtonWrap>
    </LongPressToResizeButton>
  );
};

const HeartButtonWrap = styled.div`
  cursor: pointer;
  display: flex;
`;

export default HeartButton;
