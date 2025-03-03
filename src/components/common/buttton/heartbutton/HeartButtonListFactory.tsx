import { onClickHeartGlobalState } from 'global/globalstateaction/onClickHeartGlobalState';
import React from 'react';
import { PostLikeRsp } from '../../../../global/interface/post';
import HeartButton from './HeartButton';

interface HeartButtonListFactoryProps {
  username: string;
  postId: string;
  isLiked: boolean;
}

const HeartButtonListFactory: React.FC<HeartButtonListFactoryProps> = ({
  username,
  postId,
  isLiked,
}) => {
  // const { data: profilePost } = QueryStateProfilePost(postId, true);

  const setHeartListButtonState = (value: PostLikeRsp) => {
    onClickHeartGlobalState(username, postId, value.isLike);
  };

  return (
    <>
      <HeartButton
        postId={postId}
        setHeartStete={setHeartListButtonState}
        isLiked={isLiked}
      />
    </>
  );
};

export default HeartButtonListFactory;
