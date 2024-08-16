import React from 'react';
import { RecoilState, SetterOrUpdater, useRecoilState } from 'recoil';
import { PostClipRsp, PostRsp } from '../../../../global/interface/post';
import ClipButton from './ClipButton';

interface ClipButtonListFactoryProps {
  postId: string;
  postRspHashMapAtom: RecoilState<Map<string, PostRsp>>;
  systemPostRspHashMapAtom?: RecoilState<Map<string, PostRsp>>;
}

const ClipButtonListFactory: React.FC<ClipButtonListFactoryProps> = ({
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

  const setClipListButtonState = (value: PostClipRsp) => {
    if (snsSystemPostHashMap !== null && setSnsSystemPostHashMap !== null) {
      const newSnsPostHashMap = new Map(snsSystemPostHashMap);
      const snsPostTemp = newSnsPostHashMap.get(postId);
      if (snsPostTemp !== undefined) {
        newSnsPostHashMap.set(postId, {
          ...snsPostTemp,
          isClipped: value.isClipped,
        });
      }
      setSnsSystemPostHashMap(newSnsPostHashMap);
    }

    const tempSnsPostHashMap = new Map(snsPostHashMap);
    const snsPostTemp = tempSnsPostHashMap.get(postId);
    if (snsPostTemp !== undefined) {
      tempSnsPostHashMap.set(postId, {
        ...snsPostTemp,
        isClipped: value.isClipped,
      });
    }
    setSnsPostHashMap(tempSnsPostHashMap);
  };

  return (
    <>
      <ClipButton
        postId={postId}
        setClipStete={setClipListButtonState}
        isClipped={snsPostHashMap.get(postId)?.isClipped || false}
      />
    </>
  );
};

export default ClipButtonListFactory;
