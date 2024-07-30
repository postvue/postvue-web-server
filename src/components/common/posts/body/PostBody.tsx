import React from 'react';
import styled from 'styled-components';

const PostBody: React.FC = () => {
  return (
    <PostBodyContainer>
      <PostBodyWrap>
        <PostContentImg src="https://i.natgeofe.com/n/4cebbf38-5df4-4ed0-864a-4ebeb64d33a4/NationalGeographic_1468962_3x4.jpg" />
        <PostContent>
          내용 입니다. 내용 입니다. 내용 입니다. 내용 입니다. 내용 입니다. 내용
          입니다. 내용 입니다. 내용 입니다. 내용 입니다. 내용 입니다. 내용
          입니다. 내용 입니다. 내용 입니다. 내용 입니다. 내용 입니다. 내용
          입니다. 내용 입니다. 내용 입니다. 내용 입니다. 내용 입니다. 내용
          입니다. 내용 입니다. 내용 입니다. 내용 입니다. 내용 입니다. 내용
          입니다. 내용 입니다. 내용 입니다. 내용 입니다. 내용 입 😃 😃
        </PostContent>
      </PostBodyWrap>
      <PostTagContainer>
        <PostContentTag>#cat</PostContentTag>
        <PostContentTag>#animal</PostContentTag>
        <PostContentTag>#marple</PostContentTag>
      </PostTagContainer>
    </PostBodyContainer>
  );
};

const PostBodyContainer = styled.div``;

const PostBodyWrap = styled.div``;

const PostContentImg = styled.img`
  width: 100%;
`;

const PostContent = styled.div`
  font: ${({ theme }) => theme.fontSizes.Element1};
  padding: 6px 7px 0 7px;
`;

const PostTagContainer = styled.div`
  display: flex;

  gap: 8px;
`;

const PostContentTag = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead1};
  color: ${({ theme }) => theme.grey.Grey6};
`;

export default PostBody;
