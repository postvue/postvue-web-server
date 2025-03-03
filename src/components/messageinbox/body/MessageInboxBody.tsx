import { queryClient } from 'App';
import SearchButtonInput from 'components/common/input/SearchButtonInput';
import PullToRefreshComponent from 'components/PullToRefreshComponent';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_MSG_INBOX_LIST } from 'const/QueryClientConst';
import { stackRouterPush } from 'global/util/reactnative/nativeRouter';
import { useActiveUserSessionHookByIndexedDb } from 'hook/db/useActiveUserSessionHookByIndexedDb';
import MsgInboxListInfiniteScroll from 'hook/MsgInboxListInfiniteScroll';
import {
  MsgInboxListInterface,
  QueryStateMsgInboxListInfinite,
} from 'hook/queryhook/QueryStateMsgInboxListInfinite';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMsgInboxMessages } from 'services/message/getMsgInboxMessages';
import styled from 'styled-components';
import { MSG_CONTENT_IMAGE_TYPE } from '../../../const/MsgContentTypeConst';
import { CONVERSTAION_PATH, MESSAGE_PATH } from '../../../const/PathConst';
import { MESSAGE_SEARCH_INPUT_PHARSE_TEXT } from '../../../const/SystemPhraseConst';
import { convertDiffrenceDateTimeByString } from '../../../global/util/DateTimeUtil';
import theme from '../../../styles/theme';

const MessageInboxBody: React.FC = () => {
  const { activeUserSessions } = useActiveUserSessionHookByIndexedDb();

  const navigate = useNavigate();

  const { data: msgInboxMessageList } = QueryStateMsgInboxListInfinite();

  const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMsgInboxSearchInput(event.target.value);
  };

  const onSearchInputDelete = () => {
    setMsgInboxSearchInput('');
  };

  const [msgInboxSearchInput, setMsgInboxSearchInput] = useState<string>('');

  return (
    <>
      <PullToRefreshComponent
        onRefresh={async () => {
          const fetchData = await getMsgInboxMessages(PAGE_NUM);

          const data: MsgInboxListInterface = {
            pageParams: [PAGE_NUM],
            pages: [{ ...fetchData }],
          };

          queryClient.setQueryData([QUERY_STATE_MSG_INBOX_LIST], data);
        }}
      >
        <MessageInboxBodyContainer>
          <MessageSearchContainer>
            <MessageSearchWrap>
              <SearchButtonInput
                placeholder={MESSAGE_SEARCH_INPUT_PHARSE_TEXT}
                onSearchInputChange={onSearchInputChange}
                onClickDelete={onSearchInputDelete}
                value={msgInboxSearchInput}
                isActiveDeleteButton={msgInboxSearchInput !== ''}
              />
            </MessageSearchWrap>
          </MessageSearchContainer>
          <MsgInboxProfileMsgListContainer>
            {msgInboxMessageList && (
              <>
                {msgInboxMessageList?.pages
                  .flatMap((v) => v)
                  .map((value, index) => {
                    if (value.username.startsWith(msgInboxSearchInput)) {
                      return (
                        <MsgInboxProfileWrap key={index}>
                          <MsgInboxProfileImgNameWrapWrap>
                            <MsgInboxProfileActiveWrap>
                              <MsgInboxProfileImg src={value.profilePath} />
                              <MsgInboxActiveState
                                $sessionState={
                                  activeUserSessions.find(
                                    (v) => v.id === value.targetUserId,
                                  )?.sessionState || false
                                }
                              />
                            </MsgInboxProfileActiveWrap>
                            <MsgInboxNameMsgWrap>
                              <div
                                onClick={() =>
                                  stackRouterPush(
                                    navigate,
                                    `${MESSAGE_PATH}/${value.username}${CONVERSTAION_PATH}`,
                                  )
                                }
                              >
                                <MsgInboxNameWrap>
                                  <MsgInboxNickname>
                                    {value.nickname}.
                                  </MsgInboxNickname>
                                  <MsgInboxUsername>
                                    @{value.username}
                                  </MsgInboxUsername>
                                </MsgInboxNameWrap>

                                <MsgInboxRecentWrap>
                                  {value.hasMsgMedia ? (
                                    <MsgInboxRecentMsg>
                                      {value.msgMediaType ===
                                      MSG_CONTENT_IMAGE_TYPE
                                        ? '사진을 보냈습니다.'
                                        : '영상을 보냈습니다.'}
                                    </MsgInboxRecentMsg>
                                  ) : (
                                    <MsgInboxRecentMsg>
                                      {value.msgTextContent}
                                    </MsgInboxRecentMsg>
                                  )}
                                </MsgInboxRecentWrap>
                              </div>
                            </MsgInboxNameMsgWrap>
                          </MsgInboxProfileImgNameWrapWrap>
                          <MsgSubWrap>
                            {value.unreadCount > 0 && (
                              <MsgInboxUnreadWrap>
                                <MsgInboxUnreadMsgCount>
                                  {value.unreadCount}
                                </MsgInboxUnreadMsgCount>
                              </MsgInboxUnreadWrap>
                            )}
                            <MsgInboxRecentSendTime>
                              {convertDiffrenceDateTimeByString(value.sendAt)}
                            </MsgInboxRecentSendTime>
                          </MsgSubWrap>
                        </MsgInboxProfileWrap>
                      );
                    }
                  })}
              </>
            )}
            {msgInboxMessageList &&
              msgInboxMessageList.pages.flatMap((v) => v).length <= 0 && (
                <>
                  <NotMsgTargetWrap>
                    <NotMsgTargetTitle>
                      친구들을 팔로우해 대화 해 보세요.
                    </NotMsgTargetTitle>
                    {/* <SnsAnotherSharePoupElement /> */}
                  </NotMsgTargetWrap>
                </>
              )}
          </MsgInboxProfileMsgListContainer>
          <MsgInboxListInfiniteScroll />
        </MessageInboxBodyContainer>
      </PullToRefreshComponent>
    </>
  );
};

const MessageInboxBodyContainer = styled.div`
  height: 100%;
  min-height: calc(100dvh - ${theme.systemSize.header.height});
`;

const MessageSearchContainer = styled.div`
  padding: 16px 15px 16px 15px;
`;

const MessageSearchWrap = styled.div`
  border-radius: 17px;
  background-color: ${({ theme }) => theme.grey.Grey1};
  height: 36px;

  align-items: center;
  display: flex;

  width: 100%;
  cursor: pointer;
`;

const MsgSearchWrap = styled.div`
  display: flex;
`;

const MsgSearchDiv = styled.div`
  margin: auto 0px;
  color: #d3d5d6;
  width: 100%;
  border: 0px;
  height: 100%;
  background: none;
  padding-left: 7px;

  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey6};
`;

const MsgInboxProfileMsgListContainer = styled.div`
  padding: 16px 20px 0 20px;
`;
const MsgInboxProfileWrap = styled.div`
  display: flex;
  margin-bottom: 16px;
  justify-content: space-between;
`;

const MsgInboxProfileImgNameWrapWrap = styled.div`
  display: flex;
  gap: 13px;
  width: 90%;
`;

const MsgInboxProfileActiveWrap = styled.div`
  position: relative;
`;

const MsgInboxProfileImg = styled.img`
  width: 59px;
  height: 59px;
  border-radius: 30px;
  vertical-align: bottom;
  object-fit: cover;
`;

const MsgInboxActiveState = styled.div<{ $sessionState: boolean }>`
  background: ${(props) =>
    props.$sessionState ? theme.successColor.Green : theme.grey.Grey2};
  width: 15px;
  height: 15px;
  border-radius: 10px;
  border: 2px solid white;
  position: absolute;

  bottom: 0;
  right: 0px;
`;

const MsgInboxNameMsgWrap = styled.div`
  width: calc(100% - 60px);
  cursor: pointer;
`;

const MsgInboxNameWrap = styled.div`
  display: flex;
  gap: 5px;
`;

const MsgInboxUsername = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey5};
  line-height: 2;
`;

const MsgInboxNickname = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline1};
`;

const MsgInboxRecentWrap = styled.div`
  gap: 5px;
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
`;
const MsgInboxRecentMsg = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey6};
  width: 70%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
  width: 100%;
`;
const MsgInboxRecentSendTime = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey7};
  white-space: nowrap;
`;

const MsgInboxUnreadWrap = styled.div`
  display: flex;
  justify-content: end;
`;

const MsgInboxUnreadMsgCount = styled.div`
  font: ${({ theme }) => theme.fontSizes.Display1};
  color: ${({ theme }) => theme.mainColor.White};
  font-size: 12px;
  background-color: ${({ theme }) => theme.errorColor.Red};
  margin: auto 0px;
  padding: 1px 9px;
  border-radius: 30px;
`;

const MsgSubWrap = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: end;
  gap: 8px;
`;

const NotMsgTargetWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const NotMsgTargetTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body5};
  text-align: center;
  padding-bottom: 15px;
  white-space: nowrap;
`;

export default MessageInboxBody;
