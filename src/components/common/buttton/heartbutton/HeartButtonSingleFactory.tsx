import { onClickHeartGlobalState } from 'global/globalstateaction/onClickHeartGlobalState';
import React from 'react';
import { useRecoilState } from 'recoil';
import { postRspAtom } from 'states/PostAtom';
import { PostLikeRsp } from '../../../../global/interface/post';
import HeartButton from './HeartButton';

interface HeartButtonSingleFactoryProps {
  username: string;
  postId: string;
  onClickFunc?: () => void;
}

const HeartButtonSingleFactory: React.FC<HeartButtonSingleFactoryProps> = ({
  username,
  postId,
  onClickFunc,
}) => {
  const [snsPost, setSnsPost] = useRecoilState(postRspAtom);

  const setHeartSingleButtonState = (value: PostLikeRsp) => {
    // 상세 페이지 내 하트 값 변경
    setSnsPost((prev) => ({ ...prev, isLiked: value.isLike }));

    onClickHeartGlobalState(username, postId, value.isLike);
  };

  return (
    <>
      <HeartButton
        postId={postId}
        setHeartStete={setHeartSingleButtonState}
        isLiked={snsPost?.isLiked || false}
        onClickFunc={onClickFunc}
      />
    </>
  );
};

export default HeartButtonSingleFactory;
