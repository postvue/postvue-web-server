import { onClickClipGlobalState } from 'global/globalstateaction/onClickClipGlobalState';
import { QueryStateProfileAccountPostList } from 'hook/queryhook/QueryStateProfileAccountPostList';
import React from 'react';
import { useRecoilState } from 'recoil';
import { systemPostRspHashMapAtom } from 'states/SystemConfigAtom';
import { PostClipRsp } from '../../../../global/interface/post';
import ClipButton from './ClipButton';

interface ClipButtonListFactoryProps {
  username: string;
  postId: string;
}

const ClipButtonListFactory: React.FC<ClipButtonListFactoryProps> = ({
  username,
  postId,
}) => {
  const [snsSystemPostHashMap, setSnsSystemPostHashMap] = useRecoilState(
    systemPostRspHashMapAtom,
  );

  const { data: profilePostList } = QueryStateProfileAccountPostList(username);
  const snsPost = profilePostList?.pages
    .flatMap((value) => value.snsPostRspList)
    .find((value) => value.postId === postId);

  const setClipListButtonState = (value: PostClipRsp) => {
    if (snsPost) {
      onClickClipGlobalState(username, postId, !snsPost.isClipped, snsPost);
    }
    const newSnsPostHashMap = new Map(snsSystemPostHashMap);
    const snsPostTemp = newSnsPostHashMap.get(postId);
    if (snsPostTemp !== undefined) {
      newSnsPostHashMap.set(postId, {
        ...snsPostTemp,
        isClipped: value.isClipped,
      });
    }
    setSnsSystemPostHashMap(newSnsPostHashMap);
  };

  return (
    <>
      <ClipButton
        postId={postId}
        setClipStete={setClipListButtonState}
        isClipped={snsPost?.isClipped || false}
      />
    </>
  );
};

export default ClipButtonListFactory;
