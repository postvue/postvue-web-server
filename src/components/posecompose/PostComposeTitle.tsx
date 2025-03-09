import React from 'react';
import styled from 'styled-components';

interface PostComposeTitleProps {
  postTitle: string;
  setPostTitle: React.Dispatch<React.SetStateAction<string>>;
}

const PostComposeTitle: React.FC<PostComposeTitleProps> = ({
  postTitle,
  setPostTitle,
}) => {
  return (
    <PostComposeTitleWrap>
      <PostComposeTitleInput
        placeholder={'제목을 넣어주세요'}
        onChange={(e) => {
          setPostTitle(e.target.value);
        }}
        value={postTitle}
      />
    </PostComposeTitleWrap>
  );
};

const PostComposeTitleWrap = styled.div`
  padding: 23px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding} 14px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const PostComposeTitleInput = styled.input`
  width: 100%;
  outline: none;
  border: 0px;

  font: ${({ theme }) => theme.fontSizes.Subhead3};
  color: ${({ theme }) => theme.grey.Grey8};
  background-color: ${({ theme }) => theme.mainColor.White};
`;

export default PostComposeTitle;
