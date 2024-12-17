import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import {
  POST_REACTION_COMMENT_ID,
  POST_REACTION_COMMENT_NAME,
  POST_REACTION_LIKE_ID,
  POST_REACTION_LIKE_NAME,
  POST_REACTION_REPOST_ID,
  POST_REACTION_REPOST_NAME,
} from 'const/TabConfigConst';
import React from 'react';
import { useRecoilState } from 'recoil';
import { postReactionTabIdAtom } from 'states/PostReactionAtom';
import styled from 'styled-components';

interface PostReactionPopupHeaderProps {
  PostReactionTabStyle?: React.CSSProperties;
}

const PostReactionPopupHeader: React.FC<PostReactionPopupHeaderProps> = ({
  PostReactionTabStyle,
}) => {
  const reactionTabList = [
    {
      tabId: POST_REACTION_COMMENT_ID,
      tabName: POST_REACTION_COMMENT_NAME,
    },
    {
      tabId: POST_REACTION_REPOST_ID,
      tabName: POST_REACTION_REPOST_NAME,
    },
    {
      tabId: POST_REACTION_LIKE_ID,
      tabName: POST_REACTION_LIKE_NAME,
    },
  ];

  const [reactionTabId, setReactionTabId] = useRecoilState(
    postReactionTabIdAtom,
  );
  return (
    <PostReactionWrap style={PostReactionTabStyle}>
      {reactionTabList.map((v, i) => (
        <PostReactionTab
          key={i}
          className={reactionTabId === v.tabId ? ACTIVE_CLASS_NAME : ''}
          onClick={() => {
            setReactionTabId(v.tabId);
          }}
        >
          {v.tabName}
        </PostReactionTab>
      ))}
    </PostReactionWrap>
  );
};

const PostReactionWrap = styled.div`display: flex;
    justify-content: space-between;
    border-bottom : 1px solid ${({ theme }) => theme.grey.Grey2};
    z-index:1000;
}`;

const PostReactionTab = styled.div`
  width: 100%;
  text-align: center;
  cursor: pointer;

  padding-bottom: 5px;
  font: ${({ theme }) => theme.fontSizes.Subhead3};

  &.active {
    border-bottom: 2px solid;
  }
`;

export default PostReactionPopupHeader;
