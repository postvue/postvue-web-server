import { onClickClipGlobalState } from 'global/globalstateaction/onClickClipGlobalState';
import { QueryStateProfileAccountPostList } from 'hook/queryhook/QueryStateProfileAccountPostList';
import React from 'react';
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
  const { data: profilePostList } = QueryStateProfileAccountPostList(username);
  const snsPost = profilePostList?.pages
    .flatMap((value) => value.snsPostRspList)
    .find((value) => value.postId === postId);

  const setClipListButtonState = (value: PostClipRsp) => {
    if (snsPost) {
      onClickClipGlobalState(username, postId, !snsPost.isClipped, snsPost);
    }
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
