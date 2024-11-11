import { queryClient } from 'App';
import { ReactComponent as CommentSendButtonIcon } from 'assets/images/icon/svg/post/reaction/comment/CommentSendButtonIcon.svg';
import { ReactComponent as UploadImageDeleteButtonIcon } from 'assets/images/icon/svg/post/reaction/comment/UploadImageDeleteButtonIcon.svg';
import { ReactComponent as PostCommentImageIcon } from 'assets/images/icon/svg/PostCommentImageIcon.svg';
import { COMMENT_UP_ANIMATION } from 'const/PostCommentConst';
import { QUERY_STATE_POST_COMMENT_LIST } from 'const/QueryClientConst';
import { ProfileMyInfo } from 'global/interface/profile';
import { animateCount } from 'global/util/CommentUtil';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { QueryMutationCreatePostComment } from 'hook/queryhook/QueryMutationCreatePostComment';
import { QueryMutationCreatePostCommentReply } from 'hook/queryhook/QueryMutationCreatePostCommentReply';
import { PostCommetListInfiniteInterface } from 'hook/queryhook/QueryStatePostCommentListInfinite';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { activeCommentByPostCommentThreadAtom } from 'states/PostThreadAtom';
import { isLoadingPopupAtom } from 'states/SystemConfigAtom';
import styled from 'styled-components';
import { INIT_EMPTY_STRING_VALUE } from '../../../const/AttributeConst';
import { THREAD_ID, UPLOAD_COMMENT_IMAGE_ID } from '../../../const/IdNameConst';
import { POST_COMMENT_REPLAY_PLACEHOLDER } from '../../../const/SystemPhraseConst';
import {
  PostCommentReplyMsgInfo,
  PostCommentReq,
} from '../../../global/interface/post';
import { uploadImgUtil } from '../../../global/util/ImageInputUtil';
import { getMyAccountSettingInfo } from '../../../global/util/MyAccountSettingUtil';
import { isValidString } from '../../../global/util/ValidUtil';

interface CommentInputSenderElementProps {
  postId: string;
  commentSenderRef?: React.MutableRefObject<HTMLDivElement | null>;
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
  commentCountByCommentCurrent?: HTMLDivElement | null;
  containerBorderRadiusNum?: number;
}

const CommentInputSenderElement: React.FC<CommentInputSenderElementProps> = ({
  postId,
  postCommentTextareaRef,
  commentReplyCountRef,
  defaultSendPlaceHolder,
  replyMsg,
  setReplyMsg,
  isReplyToReply = false,
  isThread = false,
  threadCommentId,
  commentSenderRef,
  commentCountByCommentCurrent,
  containerBorderRadiusNum = 0,
}) => {
  const myAccountSettingInfo: ProfileMyInfo = getMyAccountSettingInfo();
  const imgFileInputRef = useRef<HTMLInputElement | null>(null);

  const activeCommentByPostCommentThread = useRecoilValue(
    activeCommentByPostCommentThreadAtom,
  );

  const setIsLoadingPopup = useSetRecoilState(isLoadingPopupAtom);

  const [uploadCommentImgFile, setUploadCommentImgFile] = useState<Blob | null>(
    null,
  );
  const [uploadCommentImgUrl, setUploadCommentImgUrl] = useState<string>(
    INIT_EMPTY_STRING_VALUE,
  );
  const [postCommentTextarea, setPostCommentTextarea] = useState(
    INIT_EMPTY_STRING_VALUE,
  );

  const [isActiveUpload, setIsActiveUpload] = useState<boolean>(false);

  const [sendPlaceHolder, setSendPlaceHolder] = useState<string>('');

  const createPostCommentReply = QueryMutationCreatePostCommentReply();
  const createPostComment = QueryMutationCreatePostComment();

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
    const snsPostCmntCreateReq: PostCommentReq = {
      postCommentMsg: postCommentTextarea,
    };
    const formData = new FormData();
    const snsPostCmntCreateBlob = new Blob(
      [JSON.stringify(snsPostCmntCreateReq)],
      {
        type: 'application/json',
      },
    );
    formData.append('snsPostCmntCreateReq', snsPostCmntCreateBlob);
    if (uploadCommentImgFile) {
      formData.append('file', uploadCommentImgFile);
    }

    setIsLoadingPopup(true);
    setPostCommentTextarea('');
    // 답글 남기기
    if (replyMsg) {
      const isReplyToCommentByThreadMsg =
        isThread &&
        (threadCommentId ? threadCommentId === replyMsg.commentId : false);

      createPostCommentReply
        .mutateAsync({
          postId: postId,
          replyCommentId: activeCommentByPostCommentThread.commentId,
          commentId: replyMsg.commentId,
          isReplyToCommentByThreadMsg: isReplyToCommentByThreadMsg,
          formData: formData,
          commentReplyCountRef: commentReplyCountRef,
        })
        .then(() => {
          setIsLoadingPopup(false);
        });

      if (activeCommentByPostCommentThread.commentId !== replyMsg.commentId)
        return;

      queryClient.setQueryData(
        [convertQueryTemplate(QUERY_STATE_POST_COMMENT_LIST, postId)],
        (oldData: PostCommetListInfiniteInterface) => {
          if (!oldData) {
            return oldData;
          }
          const updatedPages = oldData.pages.map((page) => {
            const temp = { ...page };
            temp.snsPostCommentRspList.forEach((v) => {
              if (
                v.postCommentId === activeCommentByPostCommentThread.commentId
              ) {
                v.commentCount += 1;
                console.log(commentCountByCommentCurrent);
                if (!commentCountByCommentCurrent) return;
                animateCount(
                  commentCountByCommentCurrent,
                  v.commentCount,
                  COMMENT_UP_ANIMATION,
                );
              }
            });

            return page;
          });

          return {
            ...oldData,
            pages: updatedPages,
          };
        },
      );
    }

    // 댓글 남기기
    else {
      createPostComment
        .mutateAsync({
          postId: postId,
          formData: formData,
        })
        .then(() => {
          setIsLoadingPopup(false);
        });
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
    }
  }, [replyMsg]);

  return (
    <PostCommentMsgComponent
      ref={commentSenderRef}
      $containerBorderRadiusNum={containerBorderRadiusNum}
    >
      <PostCommentMsgComponentWrap>
        <MsgMyProfileImgWrap>
          <MsgMyProfileImg src={myAccountSettingInfo.profilePath} />
        </MsgMyProfileImgWrap>
        <PostCommentMsgWrap>
          <PostCommentMsgUploadWrap>
            <PostCommentReplySendWrap>
              {uploadCommentImgUrl && (
                <PostCommentImageImgWrap>
                  <PostCommentImageImg src={uploadCommentImgUrl} />
                  <DeleteUploadImageDiv onClick={onClickDeleteUploadCommentImg}>
                    <UploadImageDeleteButtonIcon />
                  </DeleteUploadImageDiv>
                </PostCommentImageImgWrap>
              )}
              {replyMsg !== null && (
                <CommentReplyUserTag>
                  @ {replyMsg?.username}
                </CommentReplyUserTag>
              )}
              <PostCommentMsgTextarea
                rows={1}
                placeholder={
                  replyMsg !== null ? sendPlaceHolder : defaultSendPlaceHolder
                }
                ref={postCommentTextareaRef}
                value={postCommentTextarea}
                onChange={handleChangeByPostCommentMsg}
                onKeyDown={(e) => onKeyDownPostCommentTextArea(e)}
              ></PostCommentMsgTextarea>
            </PostCommentReplySendWrap>
            <MsgSendButtonWrap>
              <PostCommentUploadImageDiv>
                <PostCommentUploadImage>
                  <PostCommentUploadImgLabel htmlFor={uploadCommentImgId}>
                    <PostCommentImageIcon />
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
              </PostCommentUploadImageDiv>
              {isActiveUpload && (
                <MsgSendButton onClick={onClickSendTextComment}>
                  <CommentSendButtonIcon />
                </MsgSendButton>
              )}
            </MsgSendButtonWrap>
          </PostCommentMsgUploadWrap>
        </PostCommentMsgWrap>
      </PostCommentMsgComponentWrap>
    </PostCommentMsgComponent>
  );
};

const PostCommentMsgComponent = styled.div<{
  $containerBorderRadiusNum: number;
}>`
  width: 100%;
  position: absolute;
  bottom: 0px;
  padding: 8px 0 50px 0;
  z-index: 100;
  background-color: white;
  border-radius: 0 0 ${(props) => props.$containerBorderRadiusNum}px
    ${(props) => props.$containerBorderRadiusNum}px;
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
  width: 90%;
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

const PostCommentUploadImageDiv = styled.div`
  display: flex;
  margin: auto 0;
  padding-right: 10px;
`;

export default CommentInputSenderElement;
