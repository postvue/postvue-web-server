import React from 'react';
import { useRecoilValue } from 'recoil';
import { postRspAtom } from 'states/PostAtom';
import ClipButton from './ClipButton';

interface ClipButtonSingleFactoryProps {
  username: string;
  postId: string;
  onClickFunc?: () => void;
}

const ClipButtonSingleFactory: React.FC<ClipButtonSingleFactoryProps> = ({
  username,
  postId,
  onClickFunc,
}) => {
  const snsPost = useRecoilValue(postRspAtom);

  return (
    <>
      {snsPost && (
        <ClipButton
          postId={postId}
          username={username}
          isClipped={snsPost.isClipped}
          onClickFunc={onClickFunc}
        />
      )}
    </>
  );
};

export default ClipButtonSingleFactory;
