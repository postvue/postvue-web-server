import ClipButtonSingleFactory from 'components/common/buttton/clipbutton/ClipButtonSingleFactory';
import HeartButtonSingleFactory from 'components/common/buttton/heartbutton/HeartButtonSingleFactory';
import PostMapExploreButton from 'components/common/buttton/PostMapExploreButton';
import { PROFILE_POST_LIST_PATH } from 'const/PathConst';
import { PostRsp } from 'global/interface/post';
import { isEmptyObject } from 'global/util/ObjectUtil';
import React from 'react';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';
import MsgButton from '../../buttton/MsgButton';
import ShareButton from '../../buttton/ShareButton';

interface PostReactionSingleElementProps {
  username: string;
  postId: string;
  mainImageUrl: string;
  snsPost: PostRsp;
  onClickCloseVideo: () => void;
}

const PostReactionSingleElement: React.FC<PostReactionSingleElementProps> = ({
  username,
  postId,
  mainImageUrl,
  snsPost,
  onClickCloseVideo,
}) => {
  return (
    <>
      <ReactionContainer>
        <HrtMsgShrReactionContainer>
          <HeartButtonSingleFactory
            postId={postId}
            username={username}
            onClickFunc={onClickCloseVideo}
          />

          <MsgButton postId={postId} onClickFunc={onClickCloseVideo} />

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
            onClickFunc={onClickCloseVideo}
          />
          {!isEmptyObject(snsPost.location) && (
            <PostMapExploreButton
              latitude={snsPost.location.latitude}
              longitude={snsPost.location.longitude}
              onClickFunc={onClickCloseVideo}
            />
          )}
        </HrtMsgShrReactionContainer>
        {postId && (
          <ClipButtonSingleFactory
            username={username}
            postId={postId}
            onClickFunc={onClickCloseVideo}
          />
        )}
      </ReactionContainer>
    </>
  );
};

const ReactionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 17px 0px 8px 0;
`;

const HrtMsgShrReactionContainer = styled.div`
  display: flex;
  gap: 15px;
`;

export default PostReactionSingleElement;
