import React from 'react';
import { RecoilState, useRecoilState } from 'recoil';
import { PostLikeRsp, PostRsp } from '../../../../global/interface/post';
import HeartButton from './HeartButton';

interface HeartButtonListFactoryProps {
  postId: string;
  postRspHashMapAtom: RecoilState<Map<string, PostRsp>>;
  systemPostRspHashMapAtom: RecoilState<Map<string, PostRsp>>;
}

const HeartButtonListFactory: React.FC<HeartButtonListFactoryProps> = ({
  postId,
  postRspHashMapAtom,
  systemPostRspHashMapAtom,
}) => {
  const [snsPostHashMap, setSnsPostHashMap] =
    useRecoilState(postRspHashMapAtom);

  const [snsSystemPostHashMap, setSnsSystemPostHashMap] = useRecoilState(
    systemPostRspHashMapAtom,
  );

  const setHeartListButtonState = (value: PostLikeRsp) => {
    const tempSnsPostHashMap = new Map(snsPostHashMap);
    const snsPostTemp = tempSnsPostHashMap.get(postId);
    if (snsPostTemp !== undefined) {
      tempSnsPostHashMap.set(postId, {
        ...snsPostTemp,
        isLiked: value.isLike,
      });
    }
    setSnsPostHashMap(tempSnsPostHashMap);

    const newSnsPostHashMap = new Map(snsSystemPostHashMap);
    const snsSysPostHashMapTemp = newSnsPostHashMap.get(postId);
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
        setHeartStete={setHeartListButtonState}
        isLiked={snsPostHashMap.get(postId)?.isLiked || false}
      />
    </>
  );
};

export default HeartButtonListFactory;
