import { PROFILE_LIST_PATH } from 'const/PathConst';
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { isPostReactionAtom } from 'states/PostReactionAtom';
import styled from 'styled-components';
import { PostProfileInfoRsp } from '../../../../global/interface/post';
import theme from '../../../../styles/theme';
import FollowButton from '../../../common/buttton/FollowButton';

interface PostProfileFollowBodyProps {
  PostProfileFollowInfiniteScroll: ReactNode;
  postProfileInfoMap: Map<string, PostProfileInfoRsp>;
}

const PostProfileFollowBody: React.FC<PostProfileFollowBodyProps> = ({
  PostProfileFollowInfiniteScroll,
  postProfileInfoMap,
}) => {
  const setIsPopupActive = useSetRecoilState(isPostReactionAtom);
  const navigate = useNavigate();
  return (
    <>
      {Array.from(postProfileInfoMap.entries()).map(([k, v]) => {
        return (
          <React.Fragment key={k}>
            <PostProfileFollowContainer key={k}>
              <PostProfileFollowWrap>
                <PostProfileFollowSubWrap
                  onClick={() => {
                    setIsPopupActive(false);
                    navigate(`${PROFILE_LIST_PATH}/${v.username}`);
                  }}
                >
                  <ProfileImgUsernameWrap>
                    <PostProfileFollowImg src={v.profilePath} />
                    <PostProfileFollowUsername>
                      {v.username}
                    </PostProfileFollowUsername>
                  </ProfileImgUsernameWrap>
                </PostProfileFollowSubWrap>
                {v.isMe ? (
                  ''
                ) : (
                  <FollowButton
                    fontSize={theme.fontSizes.Subhead3}
                    userId={v.userId}
                    isFollow={v.isFollowed}
                  />
                )}
              </PostProfileFollowWrap>
            </PostProfileFollowContainer>
            <RepostBorderStickBar />
          </React.Fragment>
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
  padding: 13px 20px 11px 20px;
`;

const PostProfileFollowSubWrap = styled.div`
  width: 100%;
  cursor: pointer;
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

const RepostBorderStickBar = styled.div`
  background-color: ${({ theme }) => theme.grey.Grey2};
  width: 100%;
  height: 1px;
`;

export default PostProfileFollowBody;
