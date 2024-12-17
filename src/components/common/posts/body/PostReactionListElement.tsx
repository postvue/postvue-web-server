import ClipButtonListFactory from 'components/common/buttton/clipbutton/CliipButtonListFactory';
import HeartButtonListFactory from 'components/common/buttton/heartbutton/HeartButtonListFactory';
import React from 'react';
import { systemPostRspHashMapAtom } from 'states/SystemConfigAtom';
import styled from 'styled-components';
import MsgButton from '../../buttton/MsgButton';
import ShareButton from '../../buttton/ShareButton';

interface PostReactionListElementProps {
  username: string;
  postId: string;
  mainImageUrl: string;
}

const PostReactionListElement: React.FC<PostReactionListElementProps> = ({
  username,
  postId,
  mainImageUrl,
}) => {
  return (
    <ReactionContainer
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <HrtMsgShrReactionContainer>
        <>
          <HeartButtonListFactory
            username={username}
            postId={postId}
            systemPostRspHashMapAtom={systemPostRspHashMapAtom}
          />
          <MsgButton postId={postId} />
        </>

        <ShareButton
          shareLink={`/${username}/${postId}`}
          mainImageUrl={mainImageUrl}
        />
      </HrtMsgShrReactionContainer>

      <ClipButtonListFactory username={username} postId={postId} />
    </ReactionContainer>
  );
};

const ReactionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 17px 0px 8px 0;
  cursor: default;
`;

const HrtMsgShrReactionContainer = styled.div`
  display: flex;
  gap: 15px;
`;

export default PostReactionListElement;
