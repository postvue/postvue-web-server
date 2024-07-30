import React from 'react';
import styled from 'styled-components';

const PostHeader: React.FC = () => {
  return (
    <PostHeaderContainer>
      <PostInfoWrap>
        <PostProfileImg src="https://lh3.googleusercontent.com/proxy/v2zm-wX9m3mGQLzw7_5dhFDqEwnWNL615obK5Rd1mUhMkJahR5j6XdsyaBJQt8m7Jb4A9atWxdKYoAS0VQMiphotDnKWpo1L8JqHRbTgoahpGzY3xg" />

        <PostNotImgWrap>
          <ProfileFollowWrap>
            <PostProfileName>제시카</PostProfileName>
            <PostFollowButton>팔로우</PostFollowButton>
          </ProfileFollowWrap>
          <PostDateTimeDiv>오후 10:06</PostDateTimeDiv>
          <PostDistanceDiv>1km</PostDistanceDiv>
        </PostNotImgWrap>
      </PostInfoWrap>
    </PostHeaderContainer>
  );
};

const PostHeaderContainer = styled.div``;

const PostInfoWrap = styled.div`
  display: flex;
  padding: 8px 0 0 8px;
`;
const PostNotImgWrap = styled.div`
  display: block;
  padding-left: 6px;
`;

const PostProfileImg = styled.img`
  width: 58px;
  height: 58px;
  flex-shrink: 0;

  border-radius: 50px;
  background: url(<path-to-image>) lightgray 0px 0px / 100% 150.147% no-repeat;
`;

const ProfileFollowWrap = styled.div`
  display: flex;
  gap: 7px;
`;

const PostProfileName = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead1};
`;

const PostFollowButton = styled.div`
  color: ${({ theme }) => theme.mainColor.SkyBlue1};
  font: ${({ theme }) => theme.fontSizes.Subhead1};
`;

const PostDateTimeDiv = styled.div`
  font: ${({ theme }) => theme.fontSizes.Label};
  //   font-size: 1px;
`;

const PostDistanceDiv = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
`;

export default PostHeader;
