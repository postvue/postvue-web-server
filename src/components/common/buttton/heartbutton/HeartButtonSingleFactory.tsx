import { onClickHeartGlobalState } from 'global/globalstateaction/onClickHeartGlobalState';
import React from 'react';
import { useRecoilState } from 'recoil';
import { postRspAtom } from 'states/PostAtom';
import { systemPostRspHashMapAtom } from 'states/SystemConfigAtom';
import { PostLikeRsp } from '../../../../global/interface/post';
import HeartButton from './HeartButton';

interface HeartButtonSingleFactoryProps {
  username: string;
  postId: string;
}

const HeartButtonSingleFactory: React.FC<HeartButtonSingleFactoryProps> = ({
  username,
  postId,
}) => {
  const [snsPost, setSnsPost] = useRecoilState(postRspAtom);

  // 시스템 변경
  const [snsSystemPostHashMap, setSnsSystemPostHashMap] = useRecoilState(
    systemPostRspHashMapAtom,
  );

  const setHeartSingleButtonState = (value: PostLikeRsp) => {
    // 상세 페이지 내 하트 값 변경
    setSnsPost((prev) => ({ ...prev, isLiked: value.isLike }));

    onClickHeartGlobalState(
      username,
      postId,
      value.isLike,
      snsSystemPostHashMap,
      setSnsSystemPostHashMap,
    );
  };

  return (
    <>
      <HeartButton
        postId={postId}
        setHeartStete={setHeartSingleButtonState}
        isLiked={snsPost?.isLiked || false}
      />
    </>
  );
};

export default HeartButtonSingleFactory;
