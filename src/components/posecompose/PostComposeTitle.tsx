import { MAX_POST_TITLE_NUM } from 'const/PostConst';
import React, { useRef } from 'react';
import styled from 'styled-components';

interface PostComposeTitleProps {
  postTitle: string;
  setPostTitle: React.Dispatch<React.SetStateAction<string>>;
}

const PostComposeTitle: React.FC<PostComposeTitleProps> = ({
  postTitle,
  setPostTitle,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <PostComposeTitleWrap>
      <PostComposeTitleInput
        ref={inputRef}
        placeholder={'제목을 넣어주세요'}
        onChange={(e) => {
          if (e.target.value.length > MAX_POST_TITLE_NUM) return;
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
  overflow-x: auto;
  white-space: nowrap;
  direction: ltr;

  font: ${({ theme }) => theme.fontSizes.Subhead3};
  color: ${({ theme }) => theme.grey.Grey8};
  background-color: ${({ theme }) => theme.mainColor.White};
`;

export default PostComposeTitle;
