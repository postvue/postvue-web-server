import React from 'react';
import { RecoilState } from 'recoil';
import styled from 'styled-components';
import { PostRsp } from '../../../../global/interface/post';
import ClipButtonFactory from '../../buttton/ClipButtonFactory';
import HeartButtonFactory from '../../buttton/HeartButtonFactory';
import MsgButton from '../../buttton/MsgButton';
import ShareButton from '../../buttton/ShareButton';

interface PostReactionSingleElementProps {
  postId: string;
  postRspAtom: RecoilState<PostRsp>;
  funcHeartState?: () => void;
  funcClipState?: () => void;
}

const PostReactionSingleElement: React.FC<PostReactionSingleElementProps> = ({
  postId,
  postRspAtom,
  funcHeartState,
  funcClipState,
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
              funcHeartState={funcHeartState}
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
          funcState={funcClipState}
        />
      )}
    </ReactionContainer>
  );
};

const ReactionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 17px 0px 8px 0;
`;

const HrtMsgShrReactionContainer = styled.div`
  display: flex;
  gap: 9px;
`;

export default PostReactionSingleElement;
