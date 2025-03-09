import {
  MSG_CONTENT_IMAGE_TYPE,
  MSG_CONTENT_VIDEO_TYPE,
} from 'const/MsgContentTypeConst';
import { PostContentInterface } from 'global/interface/post';
import { isEmptyObject } from 'global/util/ObjectUtil';
import { isValidString } from 'global/util/ValidUtil';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { postContentZoomPopupInfoAtom } from 'states/PostAtom';
import styled from 'styled-components';
import theme from 'styles/theme';
import { MsgConversation } from '../../../global/interface/message';

interface ConversationMsgTemplateProps {
  msgConversation: MsgConversation;
  isMe: boolean;
}

const ConversationMsgitem: React.FC<ConversationMsgTemplateProps> = ({
  msgConversation,
  isMe,
}) => {
  const setPostContentZoomPopupInfo = useSetRecoilState(
    postContentZoomPopupInfoAtom,
  );

  function getOriginFromUrl(url: string) {
    try {
      const urlObj = new URL(url);
      return urlObj.origin; // 'https://example.com'
    } catch (error) {
      return url;
    }
  }

  const navigate = useNavigate();

  return (
    <MsgConversationItem $isMe={isMe}>
      {msgConversation.hasMsgMedia && (
        <>
          {msgConversation.msgMediaType === MSG_CONTENT_IMAGE_TYPE ? (
            <MsgImgWrap
              onClick={() => {
                setPostContentZoomPopupInfo({
                  isActive: true,
                  initIndex: 0,
                  postContents: [
                    {
                      postContentType: msgConversation.msgMediaType,
                      content: msgConversation.msgMediaContent,
                      ascSortNum: 0,
                      previewImg: '',
                      isUploaded: false,
                      videoDuration: 0,
                    } as PostContentInterface,
                  ],
                });
              }}
            >
              <MsgImg src={msgConversation.msgMediaContent} />
            </MsgImgWrap>
          ) : msgConversation.msgMediaType === MSG_CONTENT_VIDEO_TYPE ? (
            <></>
          ) : (
            <></>
          )}
        </>
      )}
      {isValidString(msgConversation.msgTextContent) && (
        <MsgTextWrap $isMe={isMe}>
          <MsgText>{msgConversation.msgTextContent}</MsgText>
        </MsgTextWrap>
      )}
      {!isEmptyObject(msgConversation.msgLinkMetaInfo) && (
        <LinkMetaWrap
          onClick={(e) => {
            e.stopPropagation();
            try {
              const urlObj = new URL(msgConversation.msgTextContent);
              if (urlObj.hostname === location.origin) {
                // 같은 도메인일 경우 navigate로 이동
                navigate(urlObj.pathname + urlObj.search + urlObj.hash);
              } else {
                // 다른 도메인일 경우 새 탭에서 열기
                window.open(
                  msgConversation.msgTextContent,
                  '_blank',
                  'noopener,noreferrer',
                );
              }
            } catch (error) {
              console.error('유효하지 않은 URL입니다:', error);
            }
          }}
        >
          <LinkMetaImg $src={msgConversation.msgLinkMetaInfo.ogImage} />
          <LinkMetaTextInfoWrap>
            <LinkMetaTitle>
              {msgConversation.msgLinkMetaInfo.ogTitle}
            </LinkMetaTitle>
            <LinkMetaDescription>
              {msgConversation.msgLinkMetaInfo.ogDescritpion}
            </LinkMetaDescription>
            <LinkMetaLink>
              {getOriginFromUrl(msgConversation.msgTextContent)}
            </LinkMetaLink>
          </LinkMetaTextInfoWrap>
        </LinkMetaWrap>
      )}
    </MsgConversationItem>
  );
};

const MsgConversationItem = styled.div<{ $isMe: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$isMe ? `end` : 'start')};
  gap: 10px;

  max-width: 259px;

  word-break: break-all;
`;

const MsgImgWrap = styled.div`
  width: 100%;
`;

const MsgImg = styled.img`
  width: 100%;
  border-radius: 20px;
  vertical-align: bottom;
  margin-bottom: 5px;
`;

const MsgTextWrap = styled.div<{ $isMe: boolean }>`
  background-color: ${(props) =>
    props.$isMe ? theme.mainColor.Blue : theme.grey.Grey1};
  color: ${(props) => (props.$isMe ? `white` : 'black')};
  padding: 9px 12px;
  border-radius: 20px;
  display: inline-block;
`;

const MsgText = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
`;

const LinkMetaWrap = styled.div`
  border-radius: 20px;
  margin-top: 5px;
  border: 1px solid ${({ theme }) => theme.grey.Grey2};
  width: 100%;
`;

const LinkMetaTextInfoWrap = styled.div`
  border-radius: 0 0 20px 20px;
  padding: 5px 10px 20px 10px;
`;

const LinkMetaImg = styled.div<{ $src: string }>`
  background: url(${(props) => props.$src}) center center / cover;
  height: 180px;

  border-radius: 20px 20px 0 0;

  display: flex;
  cursor: pointer;
`;

const LinkMetaTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
`;

const LinkMetaDescription = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  color: ${({ theme }) => theme.grey.Grey6};
`;

const LinkMetaLink = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  color: ${({ theme }) => theme.grey.Grey6};
`;

export default ConversationMsgitem;
