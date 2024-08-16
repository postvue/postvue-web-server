import React from 'react';
import { RecoilState, SetterOrUpdater, useRecoilState } from 'recoil';
import { PostLikeRsp, PostRsp } from '../../../../global/interface/post';
import HeartButton from './HeartButton';

interface HeartButtonSingleFactoryProps {
  postId: string;
  postRspAtom: RecoilState<PostRsp>;
  systemPostRspHashMapAtom?: RecoilState<Map<string, PostRsp>>;
}

const HeartButtonSingleFactory: React.FC<HeartButtonSingleFactoryProps> = ({
  postId,
  postRspAtom,
  systemPostRspHashMapAtom,
}) => {
  const [snsPost, setSnsPost] = useRecoilState(postRspAtom);
  let snsSystemPostHashMap: Map<string, PostRsp> | null = null;
  let setSnsSystemPostHashMap: SetterOrUpdater<Map<string, PostRsp>> | null =
    null;
  if (systemPostRspHashMapAtom) {
    [snsSystemPostHashMap, setSnsSystemPostHashMap] = useRecoilState(
      systemPostRspHashMapAtom,
    );
  }

  const setHeartSingleButtonState = (value: PostLikeRsp) => {
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

    setSnsPost((prev) => ({ ...prev, isLiked: value.isLike }));
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
