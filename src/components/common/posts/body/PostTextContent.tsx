import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import LinkifyTextComponent from 'components/LinkifyTextComponent';
import { SEARCH_POST_PATH } from 'const/PathConst';
import {
  RouteAndMoveUrlInfoType,
  SEARCH_PAGE_NAME,
  SEARCH_PAGE_STACK_NAME,
} from 'const/ReactNativeConst';
import {
  navigateToMainTab,
  navigateToTabWithUrl,
} from 'global/util/reactnative/nativeRouter';
import { isValidString } from 'global/util/ValidUtil';
import { SEARCH_PATH } from 'services/appApiPath';
import { convertDifferenceDateTimeByString } from '../../../../global/util/DateTimeUtil';

interface PostTextContentProps {
  postTitle: string;
  postBodyText: string;
  postedAt: string;
  tags: string[];
  bodyTextMaxLines?: number;
  isExpandedBodyText?: boolean;
  prevUrl?: string;
}

const PostTextContent: React.FC<PostTextContentProps> = ({
  postTitle,
  postBodyText,
  postedAt,
  tags,
  bodyTextMaxLines = 2,
  isExpandedBodyText = false,
  prevUrl,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(isExpandedBodyText);
  const [isTruncated, setIsTruncated] = useState<boolean>(false);
  const textRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    timerRef.current = setTimeout(() => {
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

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
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
      <PostDateTime>{convertDifferenceDateTimeByString(postedAt)}</PostDateTime>
      <PostTagWrap onClick={(e) => e.stopPropagation()}>
        {tags.map((v, i) => (
          <div
            onClick={() => {
              // const data: RoutePushEventDateInterface = {
              //   isShowInitBottomNavBar: true,
              // };
              // stackRouterPush(navigate, `${SEARCH_POST_PATH}/${v}`, data);'
              const param: RouteAndMoveUrlInfoType = {
                moveUrl: `${SEARCH_POST_PATH}/${v}`,
                screenStackName: SEARCH_PAGE_STACK_NAME,
              };

              if (prevUrl && prevUrl.startsWith(SEARCH_PATH)) {
                navigateToMainTab(
                  navigate,
                  SEARCH_PAGE_NAME,
                  `${SEARCH_POST_PATH}/${v}`,
                  JSON.stringify(param),
                );
              } else {
                navigateToTabWithUrl(
                  navigate,
                  SEARCH_PAGE_NAME,
                  `${SEARCH_POST_PATH}/${v}`,
                  JSON.stringify(param),
                );
              }
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
