import React from 'react';
import { RecoilState, useRecoilState } from 'recoil';
import { systemPostRspHashMapAtom } from 'states/SystemConfigAtom';
import { PostClipRsp, PostRsp } from '../../../../global/interface/post';
import ClipButton from './ClipButton';

interface ClipButtonSingleFactoryProps {
  postId: string;
  postRspAtom: RecoilState<PostRsp>;
  funcState?: () => void;
}

const ClipButtonSingleFactory: React.FC<ClipButtonSingleFactoryProps> = ({
  postId,
  postRspAtom,
  funcState,
}) => {
  const [snsPost, setSnsPost] = useRecoilState(postRspAtom);

  const [snsSystemPostHashMap, setSnsSystemPostHashMap] = useRecoilState(
    systemPostRspHashMapAtom,
  );

  const setClipSingleButtonState = (value: PostClipRsp) => {
    const newSnsPostHashMap = new Map(snsSystemPostHashMap);
    const snsPostTemp = newSnsPostHashMap.get(postId);
    if (snsPostTemp !== undefined) {
      newSnsPostHashMap.set(postId, {
        ...snsPostTemp,
        isClipped: value.isClipped,
      });
    }
    if (funcState) {
      funcState();
    }
    setSnsSystemPostHashMap(newSnsPostHashMap);

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
