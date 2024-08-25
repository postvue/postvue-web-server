import anime from 'animejs';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { INIT_EMPTY_STRING_VALUE } from '../../../../const/AttributeConst';
import { POST_COMMENT_TEXT_TYPE } from '../../../../const/PostCommentTypeConst';
import { PostCommentReq } from '../../../../global/interface/post';
import { isValidString } from '../../../../global/util/\bValidUtil';
import { convertDiffrenceDate } from '../../../../global/util/DateTimeUtil';
import { uploadImgUtil } from '../../../../global/util/ImageInputUtil';
import PostCommentInfiniteScroll from '../../../../hook/PostCommentInfiniteScroll';
import { createPostComment } from '../../../../services/post/createPostComment';
import { putPostCommentLike } from '../../../../services/post/putPostCommentLike';
import { postReactionCommentHashMapAtom } from '../../../../states/PostReactionAtom';
import theme from '../../../../styles/theme';

interface PostReactionCommentBodyProps {
  postId: string;
}

const PostReactionCommentBody: React.FC<PostReactionCommentBodyProps> = ({
  postId,
}) => {
  const [snsPostCommentHashMap, setSnsPostCommentHashMap] = useRecoilState(
    postReactionCommentHashMapAtom,
  );
  const [uploadCommentImgUrl, setUploadCommentImgUrl] = useState<string>(
    INIT_EMPTY_STRING_VALUE,
  );
  const [uploadCommentImgFile, setUploadCommentImgFile] = useState<File | null>(
    null,
  );
  const [postCommentTextarea, setPostCommentTextarea] = useState(
    INIT_EMPTY_STRING_VALUE,
  );
  const [isActiveUpload, setIsActiveUpload] = useState<boolean>(false);

  const elementsRef = useRef<Array<SVGSVGElement | null>>([]);
  const likeCountRef = useRef<Array<HTMLDivElement | null>>([]);
  const onClickCommentHeartButton = (commentId: string, index: number) => {
    if (postId) {
      putPostCommentLike(postId, commentId)
        .then((value) => {
          const newSnsPostCommentHashMap = new Map(snsPostCommentHashMap);
          const selectPostComment = newSnsPostCommentHashMap.get(commentId);

          if (selectPostComment) {
            const prevLikeCount = selectPostComment.likeCount;

            selectPostComment.isLiked = value.isLike;
            if (value.isLike) {
              selectPostComment.likeCount += 1;
              animateLikeCount(
                index,
                prevLikeCount,
                selectPostComment.likeCount,
                'up',
              );
            } else {
              selectPostComment.likeCount -= 1;
              animateLikeCount(
                index,
                prevLikeCount,
                selectPostComment.likeCount,
                'down',
              );
            }

            newSnsPostCommentHashMap.set(commentId, selectPostComment);
            setSnsPostCommentHashMap(newSnsPostCommentHashMap);

            if (value.isLike) {
              anime({
                targets: elementsRef.current[index],
                scale: [1, 1.5],
                duration: 300,
                easing: 'easeInOutQuad',
                direction: 'alternate',
              });
            }
          }
        })
        .catch((err) => {
          throw err;
        });
    }
  };

  const imgFileInputRef = useRef<HTMLInputElement | null>(null);
  const onClickDeleteUploadCommentImg = () => {
    if (uploadCommentImgUrl) {
      URL.revokeObjectURL(uploadCommentImgUrl);
    }
    setUploadCommentImgFile(null);
    setUploadCommentImgUrl(INIT_EMPTY_STRING_VALUE);
    if (imgFileInputRef.current) {
      imgFileInputRef.current.value = '';
    }
  };

  const postCommentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const animateLikeCount = (
    index: number,
    from: number,
    to: number,
    direction: 'up' | 'down',
  ) => {
    const likeCountRefCurrent = likeCountRef.current[index];
    if (likeCountRefCurrent !== null) {
      anime({
        targets: likeCountRef.current[index],
        translateY: direction === 'up' ? [20, 0] : [-20, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeInOutQuad',
        begin: () => {
          likeCountRefCurrent.textContent = to.toString();
        },
      });
    }
  };
  const handleChangeByPostCommentMsg = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setPostCommentTextarea(event.target.value);
  };

  const onClickSendTextComment = () => {
    const postCommentReq: PostCommentReq = {
      postCommentType: POST_COMMENT_TEXT_TYPE,
      postCommentContent: postCommentTextarea,
    };
    createPostComment(postId, postCommentReq).then((value) => {
      const newSnsPostCommentHash = new Map(snsPostCommentHashMap);
      newSnsPostCommentHash.set(value.postCommentId, value);
      setSnsPostCommentHashMap(newSnsPostCommentHash);
    });
    setPostCommentTextarea('');
  };

  useEffect(() => {
    const textarea = postCommentTextareaRef.current;

    if (textarea) {
      textarea.style.height = 'auto'; // Reset height

      textarea.style.height = `${textarea.scrollHeight - 8}px`;
    }
  }, [postCommentTextarea]);

  useEffect(() => {
    if (isValidString(postCommentTextarea) || uploadCommentImgFile) {
      setIsActiveUpload(true);
    } else {
      setIsActiveUpload(false);
    }
  }, [postCommentTextarea, uploadCommentImgFile]);
  return (
    <>
      <PostContentListContainer>
        {Array.from(snsPostCommentHashMap.entries())
          .reverse()
          .map(([k, v]) => {
            return (
              <PostContentWrap key={k}>
                <ProfileWrap>
                  <PorfileImg src={v.profilePath} />
                  <ProfileContentWrap>
                    <ProfileUserNameDateWrap>
                      <ProfileUsername>{v.username}</ProfileUsername>
                      <PostCommentDatetime>
                        {convertDiffrenceDate(v.postedAt)}
                      </PostCommentDatetime>
                    </ProfileUserNameDateWrap>
                    <PostCommentDiv>{v.postCommentContent}</PostCommentDiv>
                    <PostLikeReplyWrap>
                      <PostCommentLikeWrap>
                        <PostCommentLike
                          onClick={() =>
                            onClickCommentHeartButton(
                              v.postCommentId,
                              Number(k),
                            )
                          }
                        >
                          <PostCommentLikeIcon
                            ref={(el) => (elementsRef.current[Number(k)] = el)}
                            xmlns="http://www.w3.org/2000/svg"
                            width="19"
                            height="19"
                            viewBox="0 0 19 19"
                            fill={v.isLiked ? theme.mainColor.Red : 'none'}
                          >
                            <path
                              d="M15.4375 9.95291L9.50003 15.8334L3.56253 9.95291C3.1709 9.57181 2.86242 9.11376 2.65651 8.60758C2.4506 8.10141 2.35173 7.55808 2.36612 7.01182C2.38051 6.46555 2.50785 5.92819 2.74012 5.43355C2.97239 4.93892 3.30456 4.49774 3.71571 4.13779C4.12686 3.77784 4.60809 3.50692 5.12909 3.34208C5.65009 3.17725 6.19958 3.12208 6.74295 3.18005C7.28632 3.23801 7.8118 3.40785 8.28631 3.67888C8.76082 3.94991 9.17406 4.31625 9.50003 4.75483C9.82742 4.31943 10.2411 3.95629 10.7153 3.68814C11.1895 3.41999 11.7139 3.2526 12.2558 3.19645C12.7976 3.1403 13.3452 3.19659 13.8643 3.36181C14.3834 3.52702 14.8628 3.7976 15.2725 4.15662C15.6822 4.51563 16.0134 4.95535 16.2454 5.44824C16.4773 5.94114 16.605 6.47661 16.6205 7.02114C16.636 7.56567 16.5389 8.10753 16.3354 8.61282C16.1318 9.11811 15.8262 9.57594 15.4375 9.95766"
                              stroke={
                                v.isLiked
                                  ? theme.mainColor.Red
                                  : theme.grey.Grey7
                              }
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </PostCommentLikeIcon>
                        </PostCommentLike>
                        <PostCommentLikeCount
                          ref={(el) => (likeCountRef.current[Number(k)] = el)}
                        >
                          {v.likeCount}
                        </PostCommentLikeCount>
                      </PostCommentLikeWrap>
                      <PostCommentReplyWrap>
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
                        <PostCommentReplyCount>
                          {v.commentCount}
                        </PostCommentReplyCount>
                      </PostCommentReplyWrap>
                    </PostLikeReplyWrap>
                  </ProfileContentWrap>
                </ProfileWrap>
                <BoundaryStickBar />
              </PostContentWrap>
            );
          })}
        {postId && <PostCommentInfiniteScroll postId={postId} />}
      </PostContentListContainer>

      <PostCommentMsgComponent>
        <PostCommentMsgComponentWrap>
          <PostCommentMsgWrap>
            <PostCommentMsgUploadWrap>
              {uploadCommentImgUrl && (
                <PostCommentImageImgWrap>
                  <PostCommentImageImg src={uploadCommentImgUrl} />
                  <DeleteUploadImageDiv onClick={onClickDeleteUploadCommentImg}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                    >
                      <circle
                        cx="11"
                        cy="11"
                        r="11"
                        fill="white"
                        fillOpacity="0.7"
                      />
                      <path
                        d="M15.529 6.25488L6.47021 15.3137"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.47021 6.25488L15.529 15.3137"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </DeleteUploadImageDiv>
                </PostCommentImageImgWrap>
              )}

              <PostCommentMsgTextarea
                rows={1}
                placeholder="댓글 남기기"
                ref={postCommentTextareaRef}
                value={postCommentTextarea}
                onChange={handleChangeByPostCommentMsg}
              ></PostCommentMsgTextarea>
            </PostCommentMsgUploadWrap>
          </PostCommentMsgWrap>
        </PostCommentMsgComponentWrap>

        <PostCommentUpload>
          <PostCommentUploadTypeTab>
            <PostCommentUploadImage>
              <PostCommentUploadImgLabel htmlFor="upload-comment-image">
                <PostCommentUploadImageSvg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M1 14V16C1 16.5523 1.44772 17 2 17H16C16.5523 17 17 16.5523 17 16V11.5M1 14V2C1 1.44772 1.44772 1 2 1H16C16.5523 1 17 1.44772 17 2V11.5M1 14L4.35826 11.4813C4.73322 11.2001 5.25319 11.217 5.60905 11.522L7.7969 13.3973C8.19364 13.7374 8.78531 13.7147 9.1548 13.3452L13.2929 9.20711C13.6834 8.81658 14.3166 8.81658 14.7071 9.20711L17 11.5"
                    stroke="#3D4248"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="5"
                    cy="5"
                    r="2"
                    stroke="#3D4248"
                    strokeWidth="1.5"
                  />
                </PostCommentUploadImageSvg>
              </PostCommentUploadImgLabel>
              <PostCommentUploadInput
                id="upload-comment-image"
                ref={imgFileInputRef}
                accept="image/*"
                type="file"
                onChange={(e) => {
                  uploadImgUtil(
                    e,
                    setUploadCommentImgFile,
                    setUploadCommentImgUrl,
                  );
                }}
              />
            </PostCommentUploadImage>
            <PostCommentUploadGif>
              <PostCommentUploadGifSvg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 5.5C3 4.119 4.12 3 5.5 3H18.5C19.88 3 21 4.119 21 5.5V18.5C21 19.881 19.88 21 18.5 21H5.5C4.12 21 3 19.881 3 18.5V5.5ZM5.5 5C5.22 5 5 5.224 5 5.5V18.5C5 18.776 5.22 19 5.5 19H18.5C18.78 19 19 18.776 19 18.5V5.5C19 5.224 18.78 5 18.5 5H5.5ZM18 10.711V9.25H14.26V14.75H15.7V13.031H17.4V11.57H15.7V10.711H18ZM11.79 9.25H13.23V14.75H11.79V9.25ZM8.72 10.625C9.06 10.625 9.49 10.797 9.74 11.055L10.77 10.195C10.26 9.594 9.49 9.25 8.72 9.25C7.19 9.25 6 10.453 6 12C6 13.547 7.19 14.75 8.72 14.75C9.57 14.75 10.26 14.406 10.77 13.805V11.656H8.38V12.688H9.4V13.203C9.23 13.289 8.98 13.375 8.72 13.375C7.96 13.375 7.36 12.773 7.36 12C7.36 11.312 7.96 10.625 8.72 10.625Z"
                  fill="#3D4248"
                />
              </PostCommentUploadGifSvg>
            </PostCommentUploadGif>
          </PostCommentUploadTypeTab>
          {isActiveUpload ? (
            <PostCommentUploadButton onClick={onClickSendTextComment}>
              게시
            </PostCommentUploadButton>
          ) : (
            <PostCommentUploadDeactiveButton>
              게시
            </PostCommentUploadDeactiveButton>
          )}
        </PostCommentUpload>
      </PostCommentMsgComponent>
    </>
  );
};

const PostContentListContainer = styled.div`
  overflow: scroll;
  height: calc(100% - 230px);
`;

const PostContentWrap = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
`;

const PorfileImg = styled.img`
  width: 51px;
  height: 51px;
  border-radius: 30px;
`;

const ProfileWrap = styled.div`
  display: flex;
  padding: 13px 0 0 20px;
`;

const ProfileContentWrap = styled.div`
  padding-left: 12px;
`;
const ProfileUserNameDateWrap = styled.div`
  display: flex;
`;
const ProfileUsername = styled.div``;
const PostCommentDatetime = styled.div`
  padding-left: 7px;
`;

const PostCommentDiv = styled.div`
  padding: 6px 0 6px 0;
  font: ${({ theme }) => theme.fontSizes.Body2};
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
const PostCommentLikeCount = styled.div`
  color: ${({ theme }) => theme.grey.Grey7};
  font: ${({ theme }) => theme.fontSizes.Body2};
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

const PostCommentMsgComponent = styled.div`
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  width: 100%;
  position: fixed;
  bottom: 0;
  padding-bottom: 50px;
  background-color: ${({ theme }) => theme.mainColor.White};
`;

const PostCommentMsgComponentWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const PostCommentMsgWrap = styled.div`
  background-color: grey;
  width: 90%;
  height: 100%;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.grey.Grey2};
  display: flex;
`;

const PostCommentMsgUploadWrap = styled.div`
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-flow: column;
`;

const PostCommentImageImgWrap = styled.div`
  position: relative;
  width: 50%;
  margin-top: 15px;
`;

const PostCommentImageImg = styled.img`
  border-radius: 16px;
  width: 100%;
  vertical-align: bottom;
`;
const DeleteUploadImageDiv = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
  padding: 10px 10px 0 0;
  cursor: pointer;
`;

const PostCommentMsgTextarea = styled.textarea`
  resize: none;
  outline: none;
  width: 100%;
  font: ${({ theme }) => theme.fontSizes.Body4};
  background-color: ${({ theme }) => theme.grey.Grey2};
  border: 0;
  padding: 5px 0 5px 0;
`;

const PostCommentUpload = styled.div`
  width: 90%;
  margin: 0px auto;
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
`;

const PostCommentUploadTypeTab = styled.div`
  display: flex;
  gap: 5px;
  padding-left: 10px;
`;

const PostCommentUploadImage = styled.div`
  display: flex;
  cursor: pointer;
`;

const PostCommentUploadImgLabel = styled.label`
  display: flex;
  cursor: pointer;
`;
const PostCommentUploadInput = styled.input`
  display: none;
`;

const PostCommentUploadImageSvg = styled.svg`
  margin: auto 0;
`;
const PostCommentUploadGif = styled.div`
  display: flex;
`;

const PostCommentUploadGifSvg = styled.svg`
  margin: auto 0;
`;

const PostCommentUploadButton = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  color: ${({ theme }) => theme.mainColor.White};
  background-color: ${({ theme }) => theme.mainColor.Blue};

  text-align: center;
  margin-right: 10px;
  border-radius: 16px;
  width: 50px;
  cursor: pointer;
`;

const PostCommentUploadDeactiveButton = styled(PostCommentUploadButton)`
  opacity: 50%;
  cursor: auto;
`;

export default PostReactionCommentBody;
