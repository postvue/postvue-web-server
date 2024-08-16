import React from 'react';
import styled from 'styled-components';
import { postRspAtom } from '../../../../states/PostAtom';
import ClipButtonFactory from '../../buttton/ClipButtonFactory';
import HeartButtonFactory from '../../buttton/HeartButtonFactory';
import MsgButton from '../../buttton/MsgButton';
import ShareButton from '../../buttton/ShareButton';

interface PostReactionElementProps {
  postId: string;
}

const MyPostReactionElement: React.FC<PostReactionElementProps> = ({
  postId,
}) => {
  return (
    <ReactionContainer>
      <HrtMsgShrReactionContainer>
        {postId && (
          <>
            <HeartButtonFactory
              postId={postId}
              isList={false}
              singleState={postRspAtom}
            />
            <MsgButton postId={postId} />
          </>
        )}

        <ShareButton />
      </HrtMsgShrReactionContainer>
      {postId && (
        <ClipButtonFactory
          postId={postId}
          isList={false}
          singleState={postRspAtom}
        />
      )}
    </ReactionContainer>
  );
};

const ReactionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 17px 14px 8px 0;
`;

const HrtMsgShrReactionContainer = styled.div`
  display: flex;
  gap: 9px;
`;

export default MyPostReactionElement;
