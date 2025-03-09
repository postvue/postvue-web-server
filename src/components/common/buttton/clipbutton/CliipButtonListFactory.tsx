import React from 'react';
import ClipButton from './ClipButton';

interface ClipButtonListFactoryProps {
  username: string;
  postId: string;
  isClipped: boolean;
}

const ClipButtonListFactory: React.FC<ClipButtonListFactoryProps> = ({
  username,
  postId,
  isClipped,
}) => {
  // const { data: profilePost } = QueryStateProfilePost(postId, true);

  return (
    <>
      <ClipButton username={username} postId={postId} isClipped={isClipped} />
    </>
  );
};

export default ClipButtonListFactory;
