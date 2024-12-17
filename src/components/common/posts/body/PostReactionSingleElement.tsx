import ClipButtonSingleFactory from 'components/common/buttton/clipbutton/ClipButtonSingleFactory';
import HeartButtonSingleFactory from 'components/common/buttton/heartbutton/HeartButtonSingleFactory';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
import styled from 'styled-components';
import MsgButton from '../../buttton/MsgButton';
import ShareButton from '../../buttton/ShareButton';

interface PostReactionSingleElementProps {
  username: string;
  postId: string;
  mainImageUrl: string;
}

const PostReactionSingleElement: React.FC<PostReactionSingleElementProps> = ({
  username,
  postId,
  mainImageUrl,
}) => {
  const { windowWidth } = useWindowSize();
  return (
    <>
      <ReactionContainer>
        <HrtMsgShrReactionContainer>
          {postId && (
            <>
              <HeartButtonSingleFactory postId={postId} username={username} />
              {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM && (
                <MsgButton postId={postId} />
              )}
            </>
          )}

          <ShareButton
            shareLink={`/${username}/${postId}`}
            mainImageUrl={mainImageUrl}
          />
        </HrtMsgShrReactionContainer>
        {postId && (
          <ClipButtonSingleFactory username={username} postId={postId} />
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
