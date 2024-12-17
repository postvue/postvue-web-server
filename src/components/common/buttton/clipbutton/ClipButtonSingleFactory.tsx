import { onClickClipGlobalState } from 'global/globalstateaction/onClickClipGlobalState';
import React from 'react';
import { useRecoilState } from 'recoil';
import { postRspAtom } from 'states/PostAtom';
import { systemPostRspHashMapAtom } from 'states/SystemConfigAtom';
import { PostClipRsp } from '../../../../global/interface/post';
import ClipButton from './ClipButton';

interface ClipButtonSingleFactoryProps {
  username: string;
  postId: string;
}

const ClipButtonSingleFactory: React.FC<ClipButtonSingleFactoryProps> = ({
  username,
  postId,
}) => {
  const [snsPost, setSnsPost] = useRecoilState(postRspAtom);

  const [snsSystemPostHashMap, setSnsSystemPostHashMap] = useRecoilState(
    systemPostRspHashMapAtom,
  );

  const setClipSingleButtonState = (value: PostClipRsp) => {
    onClickClipGlobalState(username, postId, !snsPost.isClipped, snsPost);

    const newSnsPostHashMap = new Map(snsSystemPostHashMap);
    const snsPostTemp = newSnsPostHashMap.get(postId);
    if (snsPostTemp !== undefined) {
      newSnsPostHashMap.set(postId, {
        ...snsPostTemp,
        isClipped: value.isClipped,
      });
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
      />
    </>
  );
};

export default ClipButtonSingleFactory;
