import anime from 'animejs';
import React, { useRef } from 'react';
import styled from 'styled-components';
import { PostLikeRsp } from '../../../../global/interface/post';
import { putPostLike } from '../../../../services/post/putPostLike';

import { ReactComponent as PostReactionHeartButtonIcon } from 'assets/images/icon/svg/post/PostReactionHeartButtonIcon.svg';
import { ReactComponent as PostReactionHeartNotActiveButtonIcon } from 'assets/images/icon/svg/post/PostReactionHeartNotActiveButtonIcon.svg';
import { AxiosError } from 'axios';
import ReactionLongPressButtonTemplate from 'components/common/posts/body/ReactionLongPressButtonTemplate';
import { STATUS_FORBIDDEN_CODE } from 'const/HttpStatusConst';
import { fetchProfilePost } from 'global/util/channel/static/fetchProfilePost';
import { sendVibrationHeavyEvent } from 'global/util/reactnative/nativeRouter';
interface HeartButtonProps {
  setHeartStete: (postLikeGrp: PostLikeRsp) => void;
  postId: string;
  isLiked: boolean;
  onClickFunc?: () => void;
}

const HeartButton: React.FC<HeartButtonProps> = ({
  setHeartStete,
  postId,
  isLiked,
  onClickFunc,
}) => {
  const heartRef = useRef(null);

  const onClickHeartButton = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (onClickFunc) {
      onClickFunc();
    }
    if (postId) {
      putPostLike(postId)
        .then(async (value) => {
          setHeartStete(value);

          if (value.isLike) {
            anime({
              targets: heartRef.current,
              scale: [1, 1.5],
              duration: 300,
              easing: 'easeInOutQuad',
              direction: 'alternate',
            });
            sendVibrationHeavyEvent();
          }

          fetchProfilePost(postId);
        })

        .catch((err: AxiosError) => {
          const data: any = err.response?.data;
          if (err.status === STATUS_FORBIDDEN_CODE) {
            fetchProfilePost(postId);
          }
          alert(data.message);
        });
    }
  };
  return (
    <ReactionLongPressButtonTemplate resize={0.85} resizeSpeedRate={0.2}>
      <HeartButtonWrap onClick={(e) => onClickHeartButton(e)} ref={heartRef}>
        {isLiked ? (
          <PostReactionHeartButtonIcon />
        ) : (
          <PostReactionHeartNotActiveButtonIcon />
        )}
      </HeartButtonWrap>
    </ReactionLongPressButtonTemplate>
  );
};

const HeartButtonWrap = styled.div`
  cursor: pointer;
  display: flex;
`;

export default HeartButton;
