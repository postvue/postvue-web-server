import React from 'react';
import { RecoilState } from 'recoil';
import styled from 'styled-components';
import { PostRsp } from '../../../../global/interface/post';
import ClipButtonFactory from '../../buttton/ClipButtonFactory';
import HeartButtonFactory from '../../buttton/HeartButtonFactory';
import MsgButton from '../../buttton/MsgButton';
import ShareButton from '../../buttton/ShareButton';

interface PostReactionListElementProps {
  postId: string;
  postListRspAtom: RecoilState<Map<string, PostRsp>>;
}

const PostReactionListElement: React.FC<PostReactionListElementProps> = ({
  postId,
  postListRspAtom,
}) => {
  return (
    <ReactionContainer>
      <HrtMsgShrReactionContainer>
        <>
          <HeartButtonFactory
            postId={postId}
            isList={true}
            listState={postListRspAtom}
          />
          <MsgButton postId={postId} />
        </>

        <ShareButton />
      </HrtMsgShrReactionContainer>

      <ClipButtonFactory
        postId={postId}
        isList={true}
        listState={postListRspAtom}
      />
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

export default PostReactionListElement;
