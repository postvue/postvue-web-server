import { ProfileMyInfo } from 'global/interface/profile';
import React, { useEffect, useRef, useState } from 'react';
import { SetterOrUpdater } from 'recoil';
import styled from 'styled-components';
import { INIT_EMPTY_STRING_VALUE } from '../../../const/AttributeConst';
import { THREAD_ID, UPLOAD_COMMENT_IMAGE_ID } from '../../../const/IdNameConst';
import { POST_COMMENT_TEXT_TYPE } from '../../../const/PostCommentTypeConst';
import { POST_COMMENT_REPLAY_PLACEHOLDER } from '../../../const/SystemPhraseConst';
import {
  PostComment,
  PostCommentReplyMsgInfo,
  PostCommentReq,
} from '../../../global/interface/post';
import { animateCount } from '../../../global/util/CommentUtil';
import { uploadImgUtil } from '../../../global/util/ImageInputUtil';
import { getMyAccountSettingInfo } from '../../../global/util/MyAccountSettingUtil';
import { isValidString } from '../../../global/util/ValidUtil';
import { createPostComment } from '../../../services/post/createPostComment';
import { createPostCommentReply } from '../../../services/post/createPostCommentReply';

interface CommentInputSenderElementProps {
  postId: string;
  commentSenderRef?: React.MutableRefObject<HTMLDivElement | null>;
  snsPostCommentHashMap: Map<string, PostComment>;
  setSnsPostCommentHashMap: SetterOrUpdater<Map<string, PostComment>>;
  postCommentTextareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  commentReplyCountRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  defaultSendPlaceHolder: string;
  replyMsg: PostCommentReplyMsgInfo | null;
  setReplyMsg: React.Dispatch<
    React.SetStateAction<PostCommentReplyMsgInfo | null>
  >;
  isReplyToReply?: boolean;
  isThread?: boolean;
  threadCommentId?: string;
}

const CommentInputSenderElement: React.FC<CommentInputSenderElementProps> = ({
  postId,
  snsPostCommentHashMap,
  setSnsPostCommentHashMap,
  postCommentTextareaRef,
  commentReplyCountRef,
  defaultSendPlaceHolder,
  replyMsg,
  setReplyMsg,
  isReplyToReply = false,
  isThread = false,
  threadCommentId,
  commentSenderRef,
}) => {
  const myAccountSettingInfo: ProfileMyInfo = getMyAccountSettingInfo();
  const imgFileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadCommentImgFile, setUploadCommentImgFile] = useState<File | null>(
    null,
  );
  const [uploadCommentImgUrl, setUploadCommentImgUrl] = useState<string>(
    INIT_EMPTY_STRING_VALUE,
  );
  const [postCommentTextarea, setPostCommentTextarea] = useState(
    INIT_EMPTY_STRING_VALUE,
  );

  const [isActiveUpload, setIsActiveUpload] = useState<boolean>(false);

  const [sendPlaceHolder, setSendPlaceHolder] = useState<string>(
    defaultSendPlaceHolder,
  );

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

  const onClickSendTextComment = () => {
    const postCommentReq: PostCommentReq = {
      postCommentType: POST_COMMENT_TEXT_TYPE,
      postCommentContent: postCommentTextarea,
    };

    // 답글 남기기
    if (replyMsg) {
      const isReplyToCommentByThreadMsg =
        isThread &&
        (threadCommentId ? threadCommentId === replyMsg.commentId : false);
      createPostCommentReply(
        postId,
        replyMsg.commentId,
        postCommentReq,
        isReplyToCommentByThreadMsg,
      ).then((value) => {
        const tempSnsPostCommentHashMap = new Map(snsPostCommentHashMap);
        const comment = tempSnsPostCommentHashMap.get(replyMsg.commentId);

        if (comment) {
          comment.commentCount += 1;
          tempSnsPostCommentHashMap.set(replyMsg.commentId, comment);
          setSnsPostCommentHashMap(tempSnsPostCommentHashMap);
          animateCount(
            comment.postCommentId,
            comment.commentCount,
            'up',
            commentReplyCountRef,
          );
        }

        const newSnsPostCommentHash = new Map(snsPostCommentHashMap);
        newSnsPostCommentHash.set(value.postCommentId, value);
        setSnsPostCommentHashMap(newSnsPostCommentHash);
      });
      setReplyMsg(null);
      setPostCommentTextarea('');
    }
    // 댓글 남기기
    else {
      createPostComment(postId, postCommentReq).then((value) => {
        const newSnsPostCommentHash = new Map(snsPostCommentHashMap);
        newSnsPostCommentHash.set(value.postCommentId, value);
        setSnsPostCommentHashMap(newSnsPostCommentHash);
      });
      setPostCommentTextarea('');
    }
  };

  const onKeyDownPostCommentTextArea = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (!(e.key === 'Delete' || e.key === 'Backspace')) return;
    const position = e.currentTarget.selectionStart;

    if (replyMsg !== null && position === 0 && !isReplyToReply) {
      setReplyMsg(null);
    }
  };

  const handleChangeByPostCommentMsg = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setPostCommentTextarea(event.target.value);
  };

  let uploadCommentImgId = UPLOAD_COMMENT_IMAGE_ID;
  if (isThread) {
    uploadCommentImgId = `${uploadCommentImgId}-${THREAD_ID}`;
  }

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

  useEffect(() => {
    if (replyMsg !== null) {
      setSendPlaceHolder(replyMsg.username + POST_COMMENT_REPLAY_PLACEHOLDER);
    } else {
      setSendPlaceHolder(defaultSendPlaceHolder);
    }
  }, [replyMsg]);

  return (
    <PostCommentMsgComponent ref={commentSenderRef}>
      <PostCommentMsgComponentWrap>
        <MsgMyProfileImgWrap>
          <MsgMyProfileImg src={myAccountSettingInfo.profilePath} />
        </MsgMyProfileImgWrap>
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

            <PostCommentReplySendWrap>
              {replyMsg !== null && (
                <CommentReplyUserTag>
                  @ {replyMsg?.username}
                </CommentReplyUserTag>
              )}
              <PostCommentMsgTextarea
                rows={1}
                placeholder={sendPlaceHolder}
                ref={postCommentTextareaRef}
                value={postCommentTextarea}
                onChange={handleChangeByPostCommentMsg}
                onKeyDown={(e) => onKeyDownPostCommentTextArea(e)}
              ></PostCommentMsgTextarea>
            </PostCommentReplySendWrap>
            <MsgSendButtonWrap>
              {isActiveUpload && (
                <MsgSendButton onClick={onClickSendTextComment}>
                  <MsgSendButtonIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                  >
                    <path
                      d="M11 17.4168V4.5835"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.58301 11.0002L10.9997 4.5835L17.4163 11.0002"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </MsgSendButtonIcon>
                </MsgSendButton>
              )}
            </MsgSendButtonWrap>
          </PostCommentMsgUploadWrap>
        </PostCommentMsgWrap>
      </PostCommentMsgComponentWrap>
      <PostCommentUpload>
        <PostCommentUploadTypeTab>
          <PostCommentUploadImage>
            <PostCommentUploadImgLabel htmlFor={uploadCommentImgId}>
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
              id={uploadCommentImgId}
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
      </PostCommentUpload>
    </PostCommentMsgComponent>
  );
};

const PostCommentMsgComponent = styled.div`
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 8px 0 50px 0;
  background-color: ${({ theme }) => theme.mainColor.White};
  z-index: 100;
`;

const MsgMyProfileImgWrap = styled.div`
  margin: auto 0;
`;
const PostCommentMsgComponentWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 20px;
  gap: 10px;
`;

const MsgMyProfileImg = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 20px;
`;

const PostCommentMsgWrap = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.grey.Grey1};
  display: flex;
`;

const PostCommentMsgUploadWrap = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
`;

const PostCommentImageImgWrap = styled.div`
  position: relative;
  width: 60%;
  margin: auto 0;
  padding: 5px 0 5px 10px;
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

const PostCommentReplySendWrap = styled.div`
  width: 100%;
`;

const CommentReplyUserTag = styled.div`
  display: inline-block;
  margin: 9px 3px 1px 14px;
  background-color: ${({ theme }) => theme.grey.Grey2};
  padding: 4px 7px;
  border-radius: 20px;
  font: ${({ theme }) => theme.fontSizes.Body1};
  font-size: 10px;
  color: ${({ theme }) => theme.grey.Grey6};
`;

const PostCommentMsgTextarea = styled.textarea`
  resize: none;
  outline: none;
  width: 90%;
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey6};
  background-color: ${({ theme }) => theme.mainColor.White};
  border: 0;
  padding: 5px 0px 5px 0px;
  max-height: 140px;
  margin: 5px 0px 5px 15px;

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

const MsgSendButtonWrap = styled.div`
  margin: auto 0;
  display: flex;
  padding-right: 5px;
`;

const MsgSendButton = styled.div`
  background-color: ${({ theme }) => theme.mainColor.Blue};
  display: flex;

  border-radius: 20px;
  padding: 3px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: ${({ theme }) => theme.mainColor.White};
  cursor: pointer;
  margin: auto 0px;
`;

const PostCommentUpload = styled.div`
  width: calc(100% - 38px);
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

const MsgSendButtonIcon = styled.svg``;

export default CommentInputSenderElement;
