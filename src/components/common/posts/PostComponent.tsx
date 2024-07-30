import React from 'react';
import styled from 'styled-components';
import PostHeader from './header/PostHeader';
import PostBody from './body/PostBody';

const PostComponent: React.FC = () => {
  return (
    <PostComponentContainer>
      <PostHeader />
      <PostBody />
    </PostComponentContainer>
  );
};

const PostComponentContainer = styled.div`
  background-color: ${({ theme }) => theme.mainColor.White};
  width: 95%;
`;

export default PostComponent;
