import { onClickClipGlobalState } from 'global/globalstateaction/onClickClipGlobalState';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { postRspAtom } from 'states/PostAtom';
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
  const snsPost = useRecoilValue(postRspAtom);

  const setClipSingleButtonState = (value: PostClipRsp) => {
    onClickClipGlobalState(username, postId, value.isClipped, snsPost);
  };

  return (
    <>
      {snsPost && (
        <ClipButton
          postId={postId}
          setClipStete={setClipSingleButtonState}
          isClipped={snsPost.isClipped}
        />
      )}
    </>
  );
};

export default ClipButtonSingleFactory;
