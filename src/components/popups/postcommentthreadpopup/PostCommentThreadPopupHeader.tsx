import React from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';

import PrevButtonHeaderHeader from '../../layouts/PrevButtonHeaderHeader';

interface PostCommentThreadPopupHeaderProps {
  funcPrevButton: () => void;
}

const PostCommentThreadPopupHeader: React.FC<
  PostCommentThreadPopupHeaderProps
> = ({ funcPrevButton }) => {
  return (
    <PrevButtonHeaderHeader
      titleName="답글 보기"
      isActionFunc={true}
      actionFunc={funcPrevButton}
      preNodeByState={
        <PreHeaderButtonNode>
          <PreHeaderButtonNodeSub>이전</PreHeaderButtonNodeSub>
        </PreHeaderButtonNode>
      }
      HeaderLayoutStyle={{
        maxWidth: theme.systemSize.appDisplaySize.maxWidth,
        borderRadius: `${PostThreadPopupRadiusNum}px ${PostThreadPopupRadiusNum}px 0 0`,
        position: 'static',
      }}
    />
  );
};

const PostThreadPopupRadiusNum = 20;

const PreHeaderButtonNode = styled.div`
  padding-left: 18px;
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  color: ${({ theme }) => theme.grey.Grey6};
  cursor: pointer;

  position: relative;
`;

const PreHeaderButtonNodeSub = styled.div`
  &::before {
    content: '';
    position: absolute;
    top: -15px;
    bottom: -15px;
    left: -15px;
    right: -15px;
    z-index: -1; /* 가상 요소를 버튼 뒤로 배치 */
    background: transparent; /* 투명 */
  }
`;

export default PostCommentThreadPopupHeader;
