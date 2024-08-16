import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { INIT_EMPTY_STRING_VALUE } from '../../../const/AttributeConst';
import { MSG_CONTENT_TEXT_TYPE } from '../../../const/MsgContentTypeConst';
import { FollowProfileInfo } from '../../../global/interface/profile';
import msgConversationWsService from '../../../services/message/MsgConversationWsService';

interface MsgConversationSendMessageProps {
  followInfo: FollowProfileInfo;
}

const MsgConversationSendMessage: React.FC<MsgConversationSendMessageProps> = ({
  followInfo,
}) => {
  const msgConversationTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [msgConversationTextarea, setMsgConversationTextarea] = useState(
    INIT_EMPTY_STRING_VALUE,
  );

  useEffect(() => {
    const textarea = msgConversationTextareaRef.current;

    if (textarea) {
      textarea.style.height = 'auto'; // Reset height

      textarea.style.height = `${textarea.scrollHeight - 8}px`;
    }
  }, [msgConversationTextarea]);

  const onClickSendMsg = (followInfo: FollowProfileInfo): void => {
    if (isActiveSendMsg(msgConversationTextarea)) {
      msgConversationWsService.sendMessage(followInfo.msgSessionId, {
        msgType: MSG_CONTENT_TEXT_TYPE,
        msgContent: msgConversationTextarea,
      });
      setMsgConversationTextarea('');
    }
  };

  const isActiveSendMsg = (str: string) => {
    return str && !/^\s*$/.test(str);
  };

  return (
    <MsgConversationSendMessageContainer>
      <MsgConversationSendContainerWrap>
        <MsgConversationSendMessageWrap>
          <MsgSendPhotoButtonWrap>
            <MsgConversationSendPhotoButton>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 14V4.82353C0 3.71896 0.895431 2.82353 2 2.82353H4.5V2C4.5 0.89543 5.39543 0 6.5 0H11.5C12.6046 0 13.5 0.895431 13.5 2V2.82353H16C17.1046 2.82353 18 3.71896 18 4.82353V14C18 15.1046 17.1046 16 16 16H2C0.89543 16 0 15.1046 0 14ZM11.5 9C11.5 10.3807 10.3807 11.5 9 11.5C7.61929 11.5 6.5 10.3807 6.5 9C6.5 7.61929 7.61929 6.5 9 6.5C10.3807 6.5 11.5 7.61929 11.5 9ZM13 9C13 11.2091 11.2091 13 9 13C6.79086 13 5 11.2091 5 9C5 6.79086 6.79086 5 9 5C11.2091 5 13 6.79086 13 9Z"
                  fill="white"
                />
              </svg>
            </MsgConversationSendPhotoButton>
          </MsgSendPhotoButtonWrap>
          <MsgConversationSendTextFieldWrap>
            <MsgConversationSendTextField
              rows={1}
              placeholder="메시지 보내기"
              ref={msgConversationTextareaRef}
              value={msgConversationTextarea}
              onChange={(e) => setMsgConversationTextarea(e.target.value)}
            />
          </MsgConversationSendTextFieldWrap>
          <MsgSendButtonWrap>
            {isActiveSendMsg(msgConversationTextarea) && (
              <MsgSendButton onClick={() => onClickSendMsg(followInfo)}>
                게시
              </MsgSendButton>
            )}
          </MsgSendButtonWrap>
        </MsgConversationSendMessageWrap>
      </MsgConversationSendContainerWrap>
    </MsgConversationSendMessageContainer>
  );
};

const MsgConversationSendMessageContainer = styled.div`
  position: fixed;
  width: 100%;
  max-width: ${({ theme }) => theme.appDisplaySize};
  bottom: 0px;
  background-color: ${({ theme }) => theme.mainColor.White};

  padding: 15px 0 20px 0;
`;

const MsgConversationSendContainerWrap = styled.div`
  display: flex;
  padding: 0 20px;
`;

const MsgConversationSendMessageWrap = styled.div`
  display: flex;
  width: 100%;
  background-color: ${({ theme }) => theme.grey.Grey1};
  border-radius: 26px;
  padding: 5px;
`;

const MsgSendPhotoButtonWrap = styled.div`
  margin: auto 0 0 0;
`;

const MsgConversationSendPhotoButton = styled.div`
  background-color: ${({ theme }) => theme.mainColor.Blue};
  display: flex;
  padding: 10px;
  border-radius: 20px;
`;

const MsgConversationSendTextFieldWrap = styled.div`
  display: flex;
  width: 100%;
`;
const MsgConversationSendTextField = styled.textarea`
  padding: 4px 10px 4px 10px;
  width: 100%;
  font: ${({ theme }) => theme.fontSizes.Body4};
  outline: none;
  border: 0px;
  resize: none;
  overflow: hidden;
  background-color: ${({ theme }) => theme.grey.Grey1};
  line-height: 1.7;
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

export default MsgConversationSendMessage;
