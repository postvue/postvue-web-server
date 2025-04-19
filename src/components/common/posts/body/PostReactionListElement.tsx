import ClipButtonListFactory from 'components/common/buttton/clipbutton/CliipButtonListFactory';
import HeartButtonListFactory from 'components/common/buttton/heartbutton/HeartButtonListFactory';
import PostMapExploreButton from 'components/common/buttton/PostMapExploreButton';
import { PROFILE_POST_LIST_PATH } from 'const/PathConst';
import { PostRsp } from 'global/interface/post';
import { isEmptyObject } from 'global/util/ObjectUtil';
import React from 'react';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';
import MsgButton from '../../buttton/MsgButton';
import ShareButton from '../../buttton/ShareButton';

interface PostReactionListElementProps {
  username: string;
  postId: string;
  snsPost: PostRsp;
  mainImageUrl: string;
}

const PostReactionListElement: React.FC<PostReactionListElementProps> = ({
  username,
  postId,
  snsPost,
  mainImageUrl,
}) => {
  return (
    <ReactionContainer
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <HrtMsgShrReactionContainer>
        <HeartButtonListFactory
          username={username}
          postId={postId}
          isLiked={snsPost.isLiked}
        />
        <MsgButton postId={postId} />

        <ShareButton
          shareLink={
            location.origin +
            generatePath(PROFILE_POST_LIST_PATH, {
              user_id: username,
              post_id: postId,
            })
          }
          mainImageUrl={mainImageUrl}
          title={snsPost.postTitle}
          description={snsPost.postBodyText}
          address={snsPost.location.address}
        />
        {!isEmptyObject(snsPost.location) && <PostMapExploreButton />}
      </HrtMsgShrReactionContainer>

      <ClipButtonListFactory
        username={username}
        postId={postId}
        isClipped={snsPost.isClipped}
      />
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
