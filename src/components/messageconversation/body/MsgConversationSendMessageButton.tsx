import { ReactComponent as MsgConversationSernPhotoButtonIcon } from 'assets/images/icon/svg/msg/MsgConversationSernPhotoButtonIcon.svg';
import { ReactComponent as UploadImageDeleteButtonIcon } from 'assets/images/icon/svg/post/reaction/comment/UploadImageDeleteButtonIcon.svg';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { DirectMsgReq } from 'global/interface/message';
import { uploadImgUtil } from 'global/util/ImageInputUtil';
import {
  isApp,
  sendNativeImageUploadEvent,
} from 'global/util/reactnative/nativeRouter';
import useResizeObserver from 'hook/customhook/useResizeObserver';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { createDirectMsgConversation } from 'services/message/createDirectMsgConversation';
import { msgConversationScrollInfoAtom } from 'states/MessageAtom';
import { nativeUploadImgFileAtom } from 'states/NativeAtom';
import { isLoadingPopupAtom } from 'states/SystemConfigAtom';
import styled from 'styled-components';
import theme from 'styles/theme';
import { INIT_EMPTY_STRING_VALUE } from '../../../const/AttributeConst';
import { ProfileInfoByDirectMsg } from '../../../global/interface/profile';
import { isValidString } from '../../../global/util/ValidUtil';

interface MsgConversationSendMessageProps {
  followInfo: ProfileInfoByDirectMsg;
  MsgConversationBodyContainerRef: React.RefObject<HTMLDivElement>;
  MsgConversationSendMessageStyle?: React.CSSProperties;
}

const MsgConversationSendMessage: React.FC<MsgConversationSendMessageProps> = ({
  followInfo,
  MsgConversationBodyContainerRef,
  MsgConversationSendMessageStyle,
}) => {
  const msgConversationTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [msgConversationTextarea, setMsgConversationTextarea] = useState(
    INIT_EMPTY_STRING_VALUE,
  );

  const msgConversationScrollInfo = useRecoilValue(
    msgConversationScrollInfoAtom,
  );

  useEffect(() => {
    const textarea = msgConversationTextareaRef.current;

    if (textarea) {
      textarea.style.height = 'auto'; // Reset height

      textarea.style.height = `${textarea.scrollHeight - 8}px`;
    }
  }, [msgConversationTextarea]);

  const onHandleMoveEnd = () => {
    const max_gap_move = 500; // 최대한 밑으로 이동
    if (!MsgConversationBodyContainerRef.current) return;
    MsgConversationBodyContainerRef.current.scrollTo({
      top: msgConversationScrollInfo.msgContainerHeight + max_gap_move,
    });
  };

  const onClickSendMsg = (): void => {
    if (isValidString(msgConversationTextarea) || uploadMsgImgFile !== null) {
      // msgConversationWsService.sendMessage(followInfo.targetUserId, {
      //   msgType: MSG_CONTENT_TEXT_TYPE,
      //   msgContent: msgConversationTextarea,
      // });

      sendMsg(followInfo.targetUserId);

      onHandleMoveEnd();
    }
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      event.nativeEvent.isComposing === false
    ) {
      event.preventDefault();
      onClickSendMsg();
    }
  };

  const uploadMsgImgId = 'msg-send-id';

  const imgFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadMsgImgFile, setUploadMsgImgFile] = useState<Blob | null>(null);
  const [uploadMsgImgUrl, setUploadMsgImgUrl] = useState<string>(
    INIT_EMPTY_STRING_VALUE,
  );

  const [isActiveUpload, setIsActiveUpload] = useState<boolean>(false);

  const setIsLoadingPopup = useSetRecoilState(isLoadingPopupAtom);

  const sendMsg = (targetUserId: string) => {
    if (!isActiveUpload) {
      return;
    }
    const directMsgReq: DirectMsgReq = {
      msgTextContent: msgConversationTextarea,
    };

    const formData = new FormData();

    const directMsgReqBlob = new Blob([JSON.stringify(directMsgReq)], {
      type: 'application/json',
    });

    formData.append('directMsgReq', directMsgReqBlob);
    if (uploadMsgImgFile) {
      formData.append('file', uploadMsgImgFile);
    }

    setIsLoadingPopup(true);
    createDirectMsgConversation(targetUserId, formData)
      .then(() => {
        setMsgConversationTextarea('');
        setUploadMsgImgFile(null);
        setUploadMsgImgUrl(INIT_EMPTY_STRING_VALUE);
      })
      .catch((error: any) => {
        console.log(error);
        alert(error.response.data.message);
      })
      .finally(() => {
        setIsLoadingPopup(false);
      });
  };

  const onClickDeleteUploadCommentImg = () => {
    if (uploadMsgImgUrl) {
      URL.revokeObjectURL(uploadMsgImgUrl);
    }
    setUploadMsgImgFile(null);
    setUploadMsgImgUrl(INIT_EMPTY_STRING_VALUE);
    if (imgFileInputRef.current) {
      imgFileInputRef.current.value = '';
    }

    if (!msgTextfieldAndImContainergRef.current) return;
    msgTextfieldAndImContainergRef.current.style.display = 'block';
  };

  const { ref: msgTextfieldAndImContainergRef, height } = useResizeObserver();

  useEffect(() => {
    if (!msgTextfieldAndImContainergRef.current) return;

    if (
      window.innerHeight <=
      height + 2 * theme.systemSize.header.heightNumber
    ) {
      msgTextfieldAndImContainergRef.current.style.display = 'flex';
    }
  }, [height]);

  useEffect(() => {
    if (isValidString(msgConversationTextarea) || uploadMsgImgFile) {
      setIsActiveUpload(true);
    } else {
      setIsActiveUpload(false);
    }
  }, [msgConversationTextarea, uploadMsgImgFile]);

  const nativeUploadImgFile = useRecoilValue(nativeUploadImgFileAtom);
  const resetNativeUploadImgFile = useResetRecoilState(nativeUploadImgFileAtom);
  useEffect(() => {
    if (!isApp() || nativeUploadImgFile.imgFile === null) return;

    uploadImgUtil(
      nativeUploadImgFile.imgFile,
      setUploadMsgImgFile,
      setUploadMsgImgUrl,
    );
    resetNativeUploadImgFile();
  }, [nativeUploadImgFile]);

  return (
    <MsgConversationSendMessageContainer
      style={MsgConversationSendMessageStyle}
    >
      <MsgConversationSendContainerWrap>
        <MsgConversationSendMessageWrap>
          <MsgConversationSendMessageSubWrap>
            <MsgSendPhotoButtonWrap>
              <MsgConversationSendPhotoButton
                htmlFor={uploadMsgImgId}
                onClick={() => {
                  if (!isApp()) return;
                  sendNativeImageUploadEvent();
                }}
              >
                <MsgConversationSernPhotoButtonIcon />
              </MsgConversationSendPhotoButton>
              {!isApp() && (
                <MsgUploadInput
                  id={uploadMsgImgId}
                  ref={imgFileInputRef}
                  accept="image/jpeg, image/png, image/gif, image/bmp, image/webp"
                  type="file"
                  onChange={(e) => {
                    if (!e.target.files) return;
                    uploadImgUtil(
                      e.target.files[0],
                      setUploadMsgImgFile,
                      setUploadMsgImgUrl,
                    );
                  }}
                />
              )}
            </MsgSendPhotoButtonWrap>
            <MsgConversationSendTextFieldWrap
              ref={msgTextfieldAndImContainergRef}
            >
              {uploadMsgImgUrl && (
                <PostCommentImageImgWrap>
                  <PostCommentImageImg src={uploadMsgImgUrl} />
                  <DeleteUploadImageDiv onClick={onClickDeleteUploadCommentImg}>
                    <UploadImageDeleteButtonIcon />
                  </DeleteUploadImageDiv>
                </PostCommentImageImgWrap>
              )}
              <MsgConversationSendTextFielSubdWrap>
                <MsgConversationSendTextField
                  rows={1}
                  placeholder="메시지 보내기"
                  ref={msgConversationTextareaRef}
                  value={msgConversationTextarea}
                  onChange={(e) => {
                    setMsgConversationTextarea(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    handleKeyPress(e);
                  }}
                />
              </MsgConversationSendTextFielSubdWrap>
            </MsgConversationSendTextFieldWrap>
            <MsgSendButtonWrap>
              {(isValidString(msgConversationTextarea) ||
                (isValidString(uploadMsgImgUrl) &&
                  uploadMsgImgFile !== null)) && (
                <MsgSendButton
                  onClick={(e) => {
                    e.stopPropagation();

                    onClickSendMsg();
                  }}
                >
                  게시
                </MsgSendButton>
              )}
            </MsgSendButtonWrap>
          </MsgConversationSendMessageSubWrap>
        </MsgConversationSendMessageWrap>
      </MsgConversationSendContainerWrap>
    </MsgConversationSendMessageContainer>
  );
};

const MsgConversationSendMessageContainer = styled.div`
  position: fixed;
  flex-shrink: 0;
  width: 100%;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${theme.systemSize.appDisplaySize.widthByPc};
  }
  bottom: 0px;
  background-color: ${({ theme }) => theme.mainColor.White};

  padding: 15px 0 calc(10px + env(safe-area-inset-bottom)) 0;
`;

const MsgConversationSendContainerWrap = styled.div`
  display: flex;
  padding: 0 20px;
`;

const MsgConversationSendMessageWrap = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 26px;
  border: 1px solid ${({ theme }) => theme.grey.Grey2};
  padding: 5px;
`;

const MsgConversationSendMessageSubWrap = styled.div`
  display: flex;
  width: 100%;
  background-color: white;
  border-radius: 26px;
`;

const MsgSendPhotoButtonWrap = styled.div`
  margin: auto 0 0 0;
`;

const MsgConversationSendPhotoButton = styled.label`
  background-color: ${({ theme }) => theme.mainColor.Blue};
  display: flex;
  padding: 10px;
  border-radius: 20px;
`;

const MsgConversationSendTextFieldWrap = styled.div`
  width: 100%;
`;

const MsgConversationSendTextFielSubdWrap = styled.div`
  width: 100%;
  margin: auto 0;
  display: flex;
`;
const MsgConversationSendTextField = styled.textarea`
  padding: 4px 0px 4px 10px;
  margin-right: 10px;
  width: 100%;
  font: ${({ theme }) => theme.fontSizes.Body3};
  outline: none;
  border: 0px;
  resize: none;
  background-color: white;
  line-height: 1.7;

  max-height: 140px;
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
  margin: auto 0 0 0;
`;

const MsgSendButton = styled.div`
  background-color: ${({ theme }) => theme.mainColor.Blue};
  display: flex;

  border-radius: 20px;
  width: 28px;
  padding: 5px 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: ${({ theme }) => theme.mainColor.White};
  font: ${({ theme }) => theme.fontSizes.Body4};
  cursor: pointer;
`;

const MsgUploadInput = styled.input`
  display: none;
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

export default MsgConversationSendMessage;
