import React, { useRef } from 'react';
import styled from 'styled-components';

import theme from 'styles/theme';

import { MAX_POST_BODY_TEXT_NUM } from 'const/PostConst';
import useAutoBlur from 'hook/customhook/useAutoBlur';

interface PostComposeBodyDescProps {
  postBodyText: string;
  setPostBodyText: React.Dispatch<React.SetStateAction<string>>;
}

const PostComposeBodyDesc: React.FC<PostComposeBodyDescProps> = ({
  postBodyText,
  setPostBodyText,
}) => {
  const textareaParentRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoBlur([textareaParentRef, textareaRef], undefined, undefined, false);

  return (
    <PostComposeDescWrap ref={textareaParentRef}>
      <PostComposeDesc
        ref={textareaRef}
        style={{
          height: textareaParentRef.current
            ? textareaParentRef.current.clientHeight - 10 + 'px'
            : 'auto',
        }}
        placeholder={'게시물 본문을 작성하세요.'}
        onChange={(e) => {
          if (e.target.value.length > MAX_POST_BODY_TEXT_NUM) return;
          setPostBodyText(e.target.value);
        }}
        value={postBodyText}
      />
      <PostComposeDescMaxNum>
        {postBodyText.length} / {MAX_POST_BODY_TEXT_NUM}
      </PostComposeDescMaxNum>
    </PostComposeDescWrap>
  );
};

const PostComposeDescWrap = styled.div`
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  flex: 1;
  position: relative;
`;

const PostComposeDescMaxNum = styled.div`
  position: absolute;
  font: ${({ theme }) => theme.fontSizes.Body1};
  padding: 5px 5px;
  margin-bottom: 3px;
  border-radius: 20px;
  bottom: 0px;
  right: 0px;
  backdrop-filter: blur(1px);
  color: ${theme.grey.Grey5};
`;

const PostComposeDesc = styled.textarea`
  resize: none;
  width: 100%;

  font: ${({ theme }) => theme.fontSizes.Body3};
  outline: none;
  border: 0px;

  color: ${({ theme }) => theme.grey.Grey8};
  background-color: ${({ theme }) => theme.mainColor.White};

  &::-webkit-scrollbar {
    display: block;
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.grey.Grey5};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${({ theme }) => theme.grey.Grey1};
  }
`;

export default PostComposeBodyDesc;
