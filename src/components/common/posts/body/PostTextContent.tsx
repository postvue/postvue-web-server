import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { SEARCH_POST_PATH } from '../../../../const/PathConst';

import LinkifyTextComponent from 'components/LinkifyTextComponent';
import { RoutePushEventDateInterface } from 'const/ReactNativeConst';
import { stackRouterPush } from 'global/util/reactnative/nativeRouter';
import { isValidString } from 'global/util/ValidUtil';
import { convertDiffrenceDateTimeByString } from '../../../../global/util/DateTimeUtil';

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

  const navigate = useNavigate();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    setTimeout(() => {
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
    }, 100);
  }, [bodyTextMaxLines]);

  return (
    <>
      <PostTitle>{postTitle}</PostTitle>
      {isValidString(postBodyText) && (
        <PostTextFieldContentWrap>
          <PostTextFieldContent
            ref={textRef}
            $isExpanded={isExpanded}
            $maxLines={bodyTextMaxLines}
          >
            <LinkifyTextComponent text={postBodyText} />
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
      <PostDateTime>{convertDiffrenceDateTimeByString(postedAt)}</PostDateTime>
      <PostTagWrap onClick={(e) => e.stopPropagation()}>
        {tags.map((v, i) => (
          <div
            onClick={() => {
              const data: RoutePushEventDateInterface = {
                isShowInitBottomNavBar: true,
              };
              stackRouterPush(navigate, `${SEARCH_POST_PATH}/${v}`, data);
            }}
            key={i}
          >
            <PostTag>#{v}</PostTag>
          </div>
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
  $isExpanded: boolean;
  $maxLines: number;
}>`
  font: ${({ theme }) => theme.fontSizes.Body2};
  font-size: 15px;
  color: ${({ theme }) => theme.grey.Grey8};
  margin-bottom: 15px;

  display: -webkit-box;
  -webkit-line-clamp: ${(props) =>
    props.$isExpanded ? 'none' : props.$maxLines};
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
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey5};
  cursor: pointer;
`;

const BodyExpandedButton = styled.div`
  position: absolute;
  cursor: pointer;
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
