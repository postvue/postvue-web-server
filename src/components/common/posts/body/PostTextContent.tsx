import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SEARCH_PATH } from '../../../../const/PathConst';

import { isValidString } from 'global/util/ValidUtil';
import { convertDtStrToDTStr } from '../../../../global/util/DateTimeUtil';

interface PostTextContentProps {
  postTitle: string;
  postBodyText: string;
  postedAt: string;
  tags: string[];
  bodyTextMaxLines?: number;
  isExpandedBodyText?: boolean;
}

const PostTextContent: React.FC<PostTextContentProps> = ({
  postTitle,
  postBodyText,
  postedAt,
  tags,
  bodyTextMaxLines = 2,
  isExpandedBodyText = false,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(isExpandedBodyText);
  const [isTruncated, setIsTruncated] = useState<boolean>(false);
  const textRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (textRef.current) {
      const textHeight = textRef.current.scrollHeight;
      const lineHeight = parseFloat(
        getComputedStyle(textRef.current).lineHeight,
      );
      const maxAllowedHeight = lineHeight * bodyTextMaxLines;

      if (textHeight > maxAllowedHeight) {
        setIsTruncated(true);
      }
    }
  }, [bodyTextMaxLines]);

  return (
    <>
      <PostTitle>{postTitle}</PostTitle>
      {isValidString(postBodyText) && (
        <PostTextFieldContentWrap>
          <PostTextFieldContent
            ref={textRef}
            isExpanded={isExpanded}
            maxLines={bodyTextMaxLines}
          >
            {postBodyText}
          </PostTextFieldContent>
          {!isExpanded && isTruncated && (
            <BodyExpandedButton
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand();
              }}
            >
              ... 더 보기
            </BodyExpandedButton>
          )}
        </PostTextFieldContentWrap>
      )}
      <PostDateTime>{convertDtStrToDTStr(postedAt)}</PostDateTime>
      <PostTagWrap onClick={(e) => e.stopPropagation()}>
        {tags.map((v, i) => (
          <Link to={`${SEARCH_PATH}/${v}`} key={i}>
            <PostTag>#{v}</PostTag>
          </Link>
        ))}
      </PostTagWrap>
    </>
  );
};

const PostTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  padding-bottom: 4px;
`;

const PostTextFieldContentWrap = styled.div`
  position: relative;
`;

const PostTextFieldContent = styled.div<{
  isExpanded: boolean;
  maxLines: number;
}>`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey8};
  margin-bottom: 15px;

  display: -webkit-box;
  -webkit-line-clamp: ${(props) =>
    props.isExpanded ? 'none' : props.maxLines};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const PostDateTime = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey6};
  margin-bottom: 10px;
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

const BodyExpandedButton = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  font: ${({ theme }) => theme.fontSizes.Body3};

  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgb(255, 255, 255) 10%,
    rgb(255, 255, 255) 100%
  );
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.mainColor.White} 0%,
    ${({ theme }) => theme.mainColor.White} 10%,
    ${({ theme }) => theme.mainColor.White} 100%
  );

  padding: 0 5px 0 10px;
`;

export default PostTextContent;
