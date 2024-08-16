import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { TAG_SEARCH_PATH } from '../../../../const/PathConst';
import { POST_TEXTFIELD_TYPE } from '../../../../const/PostContentTypeConst';

import { PostContent } from '../../../../global/interface/post';
import { convertDtStrToDTStr } from '../../../../global/util/DateTimeUtil';

interface PostTextContentProps {
  postContents: PostContent[];
  postedAt: string;
  tags: string[];
}

const PostTextContent: React.FC<PostTextContentProps> = ({
  postContents,
  postedAt,
  tags,
}) => {
  return (
    <>
      {postContents.map((value, index) => {
        if (value.postContentType === POST_TEXTFIELD_TYPE) {
          return (
            <PostTextFieldContent key={index}>
              {value.content}
            </PostTextFieldContent>
          );
        }
      })}
      <PostDateTime>{convertDtStrToDTStr(postedAt)}</PostDateTime>
      <PostTagWrap onClick={(e) => e.stopPropagation()}>
        {tags.map((v, i) => (
          <Link to={`${TAG_SEARCH_PATH}/${v}`} key={i}>
            <PostTag>#{v}</PostTag>
          </Link>
        ))}
      </PostTagWrap>
    </>
  );
};

const PostTextFieldContent = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
`;
const PostDateTime = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey6};
  margin: 15px 0 15px 0;
`;

const PostTagWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
`;
const PostTag = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey5};
  cursor: pointer;
`;

export default PostTextContent;
