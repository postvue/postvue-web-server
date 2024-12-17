import anime from 'animejs';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  PostComment,
  PostCommentReplyMsgInfo,
} from '../../../../global/interface/post';
import { convertDiffrenceDateTime } from '../../../../global/util/DateTimeUtil';

import { queryClient } from 'App';
import { POST_COMMENT_MEDIA_IMAGE_TYPE } from 'const/PostCommentConst';
import { QUERY_STATE_POST_COMMENT_REPLY_LIST } from 'const/QueryClientConst';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { QueryMutationPutPostCommentLike } from 'hook/queryhook/QueryMutationPutPostCommentLike';
import { QueryMutationPutPostCommentReplyLike } from 'hook/queryhook/QueryMutationPutPostCommentReplyLike';
import { PostCommetReplyListInfiniteInterface } from 'hook/queryhook/QueryStatePostCommentReplyListInfinite';
import { useRecoilState } from 'recoil';
import { GetPostCommentsRsp } from 'services/post/getPostComments';
import { getPostReplyReplies } from '../../../../services/post/getPostReplyReplies';
import { activeCommentByPostCommentThreadAtom } from '../../../../states/PostThreadAtom';
import theme from '../../../../styles/theme';
import PostReactionCommentSettingButton from './PostReactionCommentSettingButton';

interface PostCommentElementProps {
  postId: string;
  commentIdIndex: string;
  postComment: PostComment;
  // snsPostCommentHashMap: Map<string, PostComment>;
  // setSnsPostCommentHashMap: SetterOrUpdater<Map<string, PostComment>>;
  likeIconRef: React.MutableRefObject<{
    [key: string]: SVGSVGElement | null;
  }>;
  likeCountRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  commentReplyCountRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  postCommentTextareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  setReplyMsg: React.Dispatch<
    React.SetStateAction<PostCommentReplyMsgInfo | null>
  >;
  neededGroupBar: boolean;
  isReplyToReply: boolean;
  replyCommentNum: number;
}

const PostCommentElement: React.FC<PostCommentElementProps> = ({
  postId,
  commentIdIndex,
  postComment,
  likeIconRef,
  likeCountRef,
  commentReplyCountRef,
  postCommentTextareaRef,
  setReplyMsg,
  neededGroupBar,
  isReplyToReply,
  replyCommentNum,
}) => {
  // 상태관리 변수
  const [
    activeCommentByPostCommentThread,
    setActiveCommentByPostCommentThread,
  ] = useRecoilState(activeCommentByPostCommentThreadAtom);

  const putPostCommentLikeQuery = QueryMutationPutPostCommentLike();
  const putPostCommentReplyLikeQuery = QueryMutationPutPostCommentReplyLike();

  const onClickCommentHeartButton = async (
    commentId: string,
    index: string,
  ) => {
    // putPostCommentLike(postId, commentId)
    //   .then((value) => {
    //     const newSnsPostCommentHashMap = new Map(snsPostCommentHashMap);
    //     const selectPostComment = newSnsPostCommentHashMap.get(commentId);

    //     if (selectPostComment) {
    //       selectPostComment.isLiked = value.isLike;
    //       if (value.isLike) {
    //         selectPostComment.likeCount += 1;
    //         animateCount(
    //           index,
    //           selectPostComment.likeCount,
    //           'up',
    //           likeCountRef,
    //         );
    //       } else {
    //         selectPostComment.likeCount -= 1;
    //         animateCount(
    //           index,
    //           selectPostComment.likeCount,
    //           'down',
    //           likeCountRef,
    //         );
    //       }

    //       newSnsPostCommentHashMap.set(commentId, selectPostComment);
    //       setSnsPostCommentHashMap(newSnsPostCommentHashMap);

    //       if (value.isLike) {
    //         anime({
    //           targets: likeIconRef.current[index],
    //           scale: [1, 1.5],
    //           duration: 300,
    //           easing: 'easeInOutQuad',
    //           direction: 'alternate',
    //         });
    //       }
    //     }
    //   })
    //   .catch((err) => {
    //     throw err;
    //   });

    if (!isReplyToReply) {
      await putPostCommentLikeQuery
        .mutateAsync({
          postId: postId,
          commentId: commentId,
          likeCountRef: likeCountRef,
        })
        .then((value) => {
          if (value.isLike) {
            anime({
              targets: likeIconRef.current[index],
              scale: [1, 1.5],
              duration: 300,
              easing: 'easeInOutQuad',
              direction: 'alternate',
            });
          }
        });
    } else {
      await putPostCommentReplyLikeQuery
        .mutateAsync({
          postId: postId,
          replyCommentId: activeCommentByPostCommentThread.commentId,
          commentId: commentId,
          likeCountRef: likeCountRef,
        })
        .then((value) => {
          if (value.isLike) {
            anime({
              targets: likeIconRef.current[index],
              scale: [1, 1.5],
              duration: 300,
              easing: 'easeInOutQuad',
              direction: 'alternate',
            });
          }
        });
    }
  };

  const onClickPostCommentReply = (postComment: PostComment) => {
    if (postCommentTextareaRef.current) {
      postCommentTextareaRef.current.focus();
    }
    setReplyMsg({
      username: postComment.username,
      profilePath: postComment.profilePath,
      userId: postComment.commentUserId,
      commentId: postComment.postCommentId,
    } as PostCommentReplyMsgInfo);
  };

  const onClickGetPostReplyMore = () => {
    getPostReplyReplies(postId, commentIdIndex).then((value) => {
      console.log(activeCommentByPostCommentThread.commentId);
      queryClient.setQueryData(
        [
          convertQueryTemplate(
            QUERY_STATE_POST_COMMENT_REPLY_LIST,
            activeCommentByPostCommentThread.commentId,
          ),
        ],
        (oldData: PostCommetReplyListInfiniteInterface) => {
          if (!oldData) {
            return oldData;
          }

          const updatedPages = oldData.pages.map((page, index) => {
            if (index === 0) {
              // 첫 번째 페이지에 새로운 아이템을 추가
              return {
                ...page,
                snsPostCommentRspList: [
                  ...value,
                  ...page.snsPostCommentRspList,
                ], // 맨 앞에 새로운 아이템 추가
              } as GetPostCommentsRsp;
            }
            return page;
          });

          return {
            ...oldData,
            pages: updatedPages,
          };
        },
      );
    });
  };

  useEffect(() => {
    console.log('끼욧', postComment);
  }, [postComment.isLiked]);

  return (
    <PostContentWrap
      $isReplyToReply={isReplyToReply}
      onClick={() => {
        if (!isReplyToReply) {
          setReplyMsg({
            username: postComment.username,
            profilePath: postComment.profilePath,
            userId: postComment.commentUserId,
            commentId: postComment.postCommentId,
          } as PostCommentReplyMsgInfo);
          setActiveCommentByPostCommentThread({
            postId: postId,
            commentId: commentIdIndex,
            username: postComment.username,
            userId: postComment.commentUserId,
            isActive: true,
          });
        }
      }}
    >
      <ProfileWrap>
        <CommentGroupWrap>
          <PorfileImg src={postComment.profilePath} />
          {neededGroupBar && <CommentGroupVerticalBar />}
        </CommentGroupWrap>
        <ProfileContentWrap>
          <ProfileNameDateSettingWrap>
            <ProfileUserNameDateWrap>
              <ProfileUsername>{postComment.username}</ProfileUsername>
              <PostCommentDatetime>
                {convertDiffrenceDateTime(postComment.postedAt)}
              </PostCommentDatetime>
            </ProfileUserNameDateWrap>
            <PostReactionCommentSettingButton
              postId={postId}
              userId={postComment.commentUserId}
              username={postComment.username}
              commentId={commentIdIndex}
            />
          </ProfileNameDateSettingWrap>
          {postComment.commentMediaType === POST_COMMENT_MEDIA_IMAGE_TYPE && (
            <ImageWrapper>
              <PostCommentMediaImgContent
                src={postComment.commentMediaContent}
              />
            </ImageWrapper>
          )}
          {/* {postComment.commentMediaType === POST_COMMENT_MEDIA_VIDEO_TYPE && (
            <video src={postComment.commentMediaContent} />
          )} */}
          <PostCommentDiv>{postComment.postCommentMsg}</PostCommentDiv>
          <PostLikeReplyWrap>
            <PostCommentLikeWrap>
              <PostCommentLike
                onClick={(e) => {
                  e.stopPropagation();
                  onClickCommentHeartButton(
                    postComment.postCommentId,
                    commentIdIndex,
                  );
                }}
              >
                <PostCommentLikeIcon
                  ref={(el) => (likeIconRef.current[commentIdIndex] = el)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill={postComment.isLiked ? theme.mainColor.Red : 'none'}
                >
                  <path
                    d="M15.4375 9.95291L9.50003 15.8334L3.56253 9.95291C3.1709 9.57181 2.86242 9.11376 2.65651 8.60758C2.4506 8.10141 2.35173 7.55808 2.36612 7.01182C2.38051 6.46555 2.50785 5.92819 2.74012 5.43355C2.97239 4.93892 3.30456 4.49774 3.71571 4.13779C4.12686 3.77784 4.60809 3.50692 5.12909 3.34208C5.65009 3.17725 6.19958 3.12208 6.74295 3.18005C7.28632 3.23801 7.8118 3.40785 8.28631 3.67888C8.76082 3.94991 9.17406 4.31625 9.50003 4.75483C9.82742 4.31943 10.2411 3.95629 10.7153 3.68814C11.1895 3.41999 11.7139 3.2526 12.2558 3.19645C12.7976 3.1403 13.3452 3.19659 13.8643 3.36181C14.3834 3.52702 14.8628 3.7976 15.2725 4.15662C15.6822 4.51563 16.0134 4.95535 16.2454 5.44824C16.4773 5.94114 16.605 6.47661 16.6205 7.02114C16.636 7.56567 16.5389 8.10753 16.3354 8.61282C16.1318 9.11811 15.8262 9.57594 15.4375 9.95766"
                    stroke={
                      postComment.isLiked
                        ? theme.mainColor.Red
                        : theme.grey.Grey7
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </PostCommentLikeIcon>
              </PostCommentLike>
              <PostCommentLikeCount
                ref={(el) => (likeCountRef.current[commentIdIndex] = el)}
                $isLiked={postComment.isLiked}
              >
                {postComment.likeCount}
              </PostCommentLikeCount>
            </PostCommentLikeWrap>
            <PostCommentReplyWrap
              onClick={(e) => {
                e.stopPropagation();
                onClickPostCommentReply(postComment);
              }}
            >
              <PostCommentReply>
                <PostCommentReplyIcon
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                >
                  <path
                    d="M6.33333 7.12484H12.6667M6.33333 10.2915H11.0833M7.125 14.2498H4.75C4.12011 14.2498 3.51602 13.9996 3.07062 13.5542C2.62522 13.1088 2.375 12.5047 2.375 11.8748V5.5415C2.375 4.91161 2.62522 4.30752 3.07062 3.86213C3.51602 3.41673 4.12011 3.1665 4.75 3.1665H14.25C14.8799 3.1665 15.484 3.41673 15.9294 3.86213C16.3748 4.30752 16.625 4.91161 16.625 5.5415V11.8748C16.625 12.5047 16.3748 13.1088 15.9294 13.5542C15.484 13.9996 14.8799 14.2498 14.25 14.2498H11.875L9.5 16.6248L7.125 14.2498Z"
                    stroke="#535B63"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </PostCommentReplyIcon>
              </PostCommentReply>
              <PostCommentReplyCount
                ref={(el) =>
                  (commentReplyCountRef.current[commentIdIndex] = el)
                }
              >
                {postComment.commentCount}
              </PostCommentReplyCount>
            </PostCommentReplyWrap>
          </PostLikeReplyWrap>
          {isReplyToReply &&
            postComment.commentCount > 0 &&
            postComment.commentCount > replyCommentNum && (
              <ShowMoreReplyListWrap>
                <ShowMoreReplyListButton onClick={onClickGetPostReplyMore}>
                  <ShowMoreReplyTitle>답글 더 보기</ShowMoreReplyTitle>
                </ShowMoreReplyListButton>
              </ShowMoreReplyListWrap>
            )}
        </ProfileContentWrap>
      </ProfileWrap>

      {!neededGroupBar && <BoundaryStickBar />}
    </PostContentWrap>
  );
};

const PROFILE_IMG_SIZE = '51px';

const PostContentWrap = styled.div<{ $isReplyToReply: boolean }>`
  font: ${({ theme }) => theme.fontSizes.Body4};
  cursor: ${(props) => (props.$isReplyToReply ? 'auto' : 'pointer')};
`;

const ProfileWrap = styled.div`
  display: flex;
  padding: 13px 0 0
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const CommentGroupWrap = styled.div`
  position: relative;
`;

const CommentGroupVerticalBar = styled.div`
  width: 2px;
  position: absolute;
  height: calc(100% - ${PROFILE_IMG_SIZE} - 13px);
  background-color: ${({ theme }) => theme.grey.Grey2};
  bottom: 0px;
  left: calc(50% - 1px);
  border-radius: 1px;
`;

const PorfileImg = styled.img`
  width: ${PROFILE_IMG_SIZE};
  height: ${PROFILE_IMG_SIZE};
  border-radius: 30px;
  object-fit: cover;
`;

const ProfileContentWrap = styled.div`
  padding-left: 12px;
  width: 100%;
`;

const ProfileNameDateSettingWrap = styled.div`
    justify-content: space-between;
    display:flex;
    padding-right: ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
}`;

const ProfileUserNameDateWrap = styled.div`
  display: flex;
`;
const ProfileUsername = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const PostCommentDatetime = styled.div`
  padding-left: 7px;
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey4};
`;

const PostCommentDiv = styled.div`
  padding: 0px ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding}
    6px 0;
  font: ${({ theme }) => theme.fontSizes.Body3};
`;

const PostLikeReplyWrap = styled.div`
  display: flex;
  justify-content: space-between;
  width: 85px;
  gap: 10px;
`;

const PostCommentLikeWrap = styled.div`
  display: flex;

  gap: 3px;
`;
const PostCommentLike = styled.div`
  display: flex;
  cursor: pointer;
`;
const PostCommentLikeIcon = styled.svg`
  margin: auto 0;
`;
const PostCommentLikeCount = styled.div<{ $isLiked: boolean }>`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${(props) => (props.$isLiked ? theme.mainColor.Red : theme.grey.Grey7)};
  }
`;

const PostCommentReplyWrap = styled.div`
  display: flex;
  gap: 3px;
`;
const PostCommentReply = styled.div`
  display: flex;
  cursor: pointer;
`;
const PostCommentReplyIcon = styled.svg`
  margin: auto 0;
`;
const PostCommentReplyCount = styled.div`
  color: ${({ theme }) => theme.grey.Grey7};
  font: ${({ theme }) => theme.fontSizes.Body2};
`;

const BoundaryStickBar = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.grey.Grey2};
  margin-top: 10px;
`;

const ShowMoreReplyListWrap = styled.div`
  display: flex;
  padding-top: 7px;
`;

const ShowMoreReplyListButton = styled.div`
  display: flex;
  cursor: pointer;
`;
const ShowMoreReplyTitle = styled.div`
  padding: 0 7px;
  color: ${({ theme }) => theme.grey.Grey5};
  font: ${({ theme }) => theme.fontSizes.Body1};
`;

const PostCommentMediaImageSize = 300;

const ImageWrapper = styled.div`
  border-radius: 10px;
  overflow: hidden;
  max-height: ${PostCommentMediaImageSize}px;
  width: inherit;
`;

const PostCommentMediaImgContent = styled.img`
  border-radius: 10px;
  max-height: ${PostCommentMediaImageSize}px;
  max-width: calc(
    100% - ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding}
  );
  object-fit: contain;
  object-position: center;
`;

export default PostCommentElement;
