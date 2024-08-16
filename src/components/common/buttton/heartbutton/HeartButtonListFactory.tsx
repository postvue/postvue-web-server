import React from 'react';
import { RecoilState, SetterOrUpdater, useRecoilState } from 'recoil';
import { PostLikeRsp, PostRsp } from '../../../../global/interface/post';
import HeartButton from './HeartButton';

interface HeartButtonListFactoryProps {
  postId: string;
  postRspHashMapAtom: RecoilState<Map<string, PostRsp>>;
  systemPostRspHashMapAtom?: RecoilState<Map<string, PostRsp>>;
}

const HeartButtonListFactory: React.FC<HeartButtonListFactoryProps> = ({
  postId,
  postRspHashMapAtom,
  systemPostRspHashMapAtom,
}) => {
  const [snsPostHashMap, setSnsPostHashMap] =
    useRecoilState(postRspHashMapAtom);
  let snsSystemPostHashMap: Map<string, PostRsp> | null = null;
  let setSnsSystemPostHashMap: SetterOrUpdater<Map<string, PostRsp>> | null =
    null;
  if (systemPostRspHashMapAtom) {
    [snsSystemPostHashMap, setSnsSystemPostHashMap] = useRecoilState(
      systemPostRspHashMapAtom,
    );
  }

  const setHeartListButtonState = (value: PostLikeRsp) => {
    if (snsSystemPostHashMap !== null && setSnsSystemPostHashMap !== null) {
      const newSnsPostHashMap = new Map(snsSystemPostHashMap);
      const snsPostTemp = newSnsPostHashMap.get(postId);
      if (snsPostTemp !== undefined) {
        newSnsPostHashMap.set(postId, {
          ...snsPostTemp,
          isLiked: value.isLike,
        });
      }
      setSnsSystemPostHashMap(newSnsPostHashMap);
    }

    const tempSnsPostHashMap = new Map(snsPostHashMap);
    const snsPostTemp = tempSnsPostHashMap.get(postId);
    if (snsPostTemp !== undefined) {
      tempSnsPostHashMap.set(postId, {
        ...snsPostTemp,
        isLiked: value.isLike,
      });
    }
    setSnsPostHashMap(tempSnsPostHashMap);
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
