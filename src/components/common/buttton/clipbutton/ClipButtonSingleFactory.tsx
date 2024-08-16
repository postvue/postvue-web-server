import React from 'react';
import { RecoilState, SetterOrUpdater, useRecoilState } from 'recoil';
import { PostClipRsp, PostRsp } from '../../../../global/interface/post';
import ClipButton from './ClipButton';

interface ClipButtonSingleFactoryProps {
  postId: string;
  postRspAtom: RecoilState<PostRsp>;
  systemPostRspHashMapAtom?: RecoilState<Map<string, PostRsp>>;
}

const ClipButtonSingleFactory: React.FC<ClipButtonSingleFactoryProps> = ({
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

  const setClipSingleButtonState = (value: PostClipRsp) => {
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

    setSnsPost((prev) => ({ ...prev, isClipped: value.isClipped }));
  };

  return (
    <>
      <ClipButton
        postId={postId}
        setClipStete={setClipSingleButtonState}
        isClipped={snsPost?.isClipped || false}
      ></ClipButton>
    </>
  );
};

export default ClipButtonSingleFactory;
