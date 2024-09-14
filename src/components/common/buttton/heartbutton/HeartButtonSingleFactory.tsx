import React from 'react';
import { RecoilState, useRecoilState } from 'recoil';
import { PostLikeRsp, PostRsp } from '../../../../global/interface/post';
import HeartButton from './HeartButton';

interface HeartButtonSingleFactoryProps {
  postId: string;
  postRspAtom: RecoilState<PostRsp>;
  systemPostRspHashMapAtom: RecoilState<Map<string, PostRsp>>;
  funcHeartState?: () => void;
}

const HeartButtonSingleFactory: React.FC<HeartButtonSingleFactoryProps> = ({
  postId,
  postRspAtom,
  systemPostRspHashMapAtom,
  funcHeartState,
}) => {
  const [snsPost, setSnsPost] = useRecoilState(postRspAtom);

  const [snsSystemPostHashMap, setSnsSystemPostHashMap] = useRecoilState(
    systemPostRspHashMapAtom,
  );

  const setHeartSingleButtonState = (value: PostLikeRsp) => {
    setSnsPost((prev) => ({ ...prev, isLiked: value.isLike }));

    const newSnsPostHashMap = new Map(snsSystemPostHashMap);
    const snsSysPostHashMapTemp = newSnsPostHashMap.get(postId);

    if (funcHeartState) {
      funcHeartState();
    }
    if (snsSysPostHashMapTemp !== undefined) {
      newSnsPostHashMap.set(postId, {
        ...snsSysPostHashMapTemp,
        isLiked: value.isLike,
      });
    }
    setSnsSystemPostHashMap(newSnsPostHashMap);
  };

  return (
    <>
      <HeartButton
        postId={postId}
        setHeartStete={setHeartSingleButtonState}
        isLiked={snsPost?.isLiked || false}
      ></HeartButton>
    </>
  );
};

export default HeartButtonSingleFactory;
