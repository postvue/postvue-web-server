import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FOLLOW_BUTTON_TEXT } from '../../../../const/SystemPhraseConst';
import { PostProfileInfoRsp } from '../../../../global/interface/post';

interface PostProfileFollowBodyProps {
  PostProfileFollowInfiniteScroll: ReactNode;
  postProfileInfoMap: Map<string, PostProfileInfoRsp>;
}

const PostProfileFollowBody: React.FC<PostProfileFollowBodyProps> = ({
  PostProfileFollowInfiniteScroll,
  postProfileInfoMap,
}) => {
  return (
    <>
      {Array.from(postProfileInfoMap.entries()).map(([k, v]) => {
        return (
          <>
            <PostProfileFollowContainer key={k}>
              <PostProfileFollowWrap>
                <Link to={`/${v.username}`}>
                  <ProfileImgUsernameWrap>
                    <PostProfileFollowImg src={v.profilePath} />
                    <PostProfileFollowUsername>
                      {v.username}
                    </PostProfileFollowUsername>
                  </ProfileImgUsernameWrap>
                </Link>
                <PostProfileFollowButton>
                  {v.isFollowed || v.isMe ? '' : FOLLOW_BUTTON_TEXT}
                </PostProfileFollowButton>
              </PostProfileFollowWrap>
            </PostProfileFollowContainer>
            <RepostBorderStickBar />
          </>
        );
      })}
      {PostProfileFollowInfiniteScroll}
    </>
  );
};

const PostProfileFollowContainer = styled.div``;
const PostProfileFollowWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 13px 14px 11px 20px;
`;
const ProfileImgUsernameWrap = styled.div`
  display: flex;
`;
const PostProfileFollowImg = styled.img`
  width: 51px;
  height: 51px;
  flex-shrink: 0;
  border-radius: 30px;
`;
const PostProfileFollowUsername = styled.div`
  margin: auto 0;
  padding-left: 12px;
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;
const PostProfileFollowButton = styled.div`
  margin: auto 0;
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  color: ${({ theme }) => theme.mainColor.Blue};
`;

const RepostBorderStickBar = styled.div`
  background-color: ${({ theme }) => theme.grey.Grey2};
  width: 100%;
  height: 1px;
`;

export default PostProfileFollowBody;
