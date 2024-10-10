import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { MSG_CONTENT_TEXT_TYPE } from '../../../const/MsgContentTypeConst';
import { CONVERSTAION_PATH, MESSAGE_PATH } from '../../../const/PathConst';
import { MESSAGE_SEARCH_INPUT_PHARSE_TEXT } from '../../../const/SystemPhraseConst';
import { convertDiffrenceDateTime } from '../../../global/util/DateTimeUtil';
import MsgInboxFollowInfiniteScroll from '../../../hook/MsgInboxFollowInfiniteScroll';
import { msgInboxMessageHashMapAtom } from '../../../states/MsgInboxAtom';
import { sessionActiveUserInfoHashMapAtom } from '../../../states/SessionAtom';
import theme from '../../../styles/theme';

const MessageInboxBody: React.FC = () => {
  const msgInboxMessageHashMap = useRecoilValue(msgInboxMessageHashMapAtom);
  const sessionActiveUserInfoHashMap = useRecoilValue(
    sessionActiveUserInfoHashMapAtom,
  );

  useEffect(() => {
    console.log('변경됨: ', sessionActiveUserInfoHashMap);
  }, [sessionActiveUserInfoHashMap]);

  return (
    <MessageInboxBodyContainer>
      <MessageSearchContainer>
        <MessageSearchWrap>
          <MessageSearchButton>
            <SearchIcon
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="19"
              viewBox="0 0 15 19"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.243 14.48C8.12495 16.2708 4.13578 15.3744 2.04394 12.2942C-0.189465 9.00541 0.585712 4.47256 3.77535 2.16975C6.96499 -0.133055 11.3612 0.666209 13.5946 3.95496C15.6871 7.03617 15.1387 11.2094 12.4381 13.6176L14.8338 17.1454C15.0624 17.4821 14.9803 17.9481 14.6503 18.1864C14.3204 18.4246 13.8675 18.3448 13.6389 18.0081L11.243 14.48ZM10.9518 12.9002C8.42859 14.6609 4.99281 14.014 3.23888 11.4313C1.46756 8.82296 2.08235 5.22794 4.61207 3.40157C7.14178 1.57521 10.6285 2.20911 12.3998 4.81742C14.1537 7.40014 13.5681 10.9503 11.1005 12.7928L10.9518 12.9002Z"
                fill="#535B63"
              />
            </SearchIcon>
          </MessageSearchButton>
          <MsgSearchWrap>
            <MsgSearchDiv>{MESSAGE_SEARCH_INPUT_PHARSE_TEXT}</MsgSearchDiv>
          </MsgSearchWrap>
        </MessageSearchWrap>
      </MessageSearchContainer>
      <FollowProfileMsgListContainer>
        {msgInboxMessageHashMap && (
          <>
            {Array.from(msgInboxMessageHashMap.entries()).map(([i, v]) => (
              <FollowProfileWrap key={i}>
                <FollowProfileImgNameWrapWrap>
                  <FollowProfileActiveWrap>
                    <FollowProfileImg src={v.profilePath} />
                    <FollowActiveState
                      $sessionState={
                        sessionActiveUserInfoHashMap.get(v.targetUserId)
                          ?.sessionState || false
                      }
                    />
                  </FollowProfileActiveWrap>
                  <FollowNameMsgWrap>
                    <Link
                      to={`${MESSAGE_PATH}/${v.username}${CONVERSTAION_PATH}`}
                    >
                      <FollowUsername>{v.username}</FollowUsername>
                      <FollowRecentWrap>
                        {v.msgType === MSG_CONTENT_TEXT_TYPE ? (
                          <FollowRecentMsg>{v.msgContent}</FollowRecentMsg>
                        ) : (
                          <FollowRecentMsg>텍스트 아님</FollowRecentMsg>
                        )}
                      </FollowRecentWrap>
                    </Link>
                  </FollowNameMsgWrap>
                </FollowProfileImgNameWrapWrap>
                <MsgSubWrap>
                  {v.unreadCount > 0 && (
                    <FollowUnreadWrap>
                      <FollowUnreadMsgCount>
                        {v.unreadCount}
                      </FollowUnreadMsgCount>
                    </FollowUnreadWrap>
                  )}
                  <FollowRecentSendTime>
                    {convertDiffrenceDateTime(v.sendAt)}
                  </FollowRecentSendTime>
                </MsgSubWrap>
              </FollowProfileWrap>
            ))}
          </>
        )}
      </FollowProfileMsgListContainer>
      <MsgInboxFollowInfiniteScroll />
    </MessageInboxBodyContainer>
  );
};

const MessageInboxBodyContainer = styled.div``;

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

const MessageSearchButton = styled.div``;

const SearchIcon = styled.svg`
  padding-left: 10px;
`;

const FollowProfileMsgListContainer = styled.div`
  padding: 16px 20px 0 20px;
`;
const FollowProfileWrap = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const FollowProfileImgNameWrapWrap = styled.div`
  display: flex;
  gap: 13px;
  width: 100%;
`;

const FollowProfileActiveWrap = styled.div`
  position: relative;
`;

const FollowProfileImg = styled.img`
  width: 59px;
  height: 59px;
  border-radius: 30px;
  vertical-align: bottom;
`;

const FollowActiveState = styled.div<{ $sessionState: boolean }>`
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

const FollowNameMsgWrap = styled.div`
  width: calc(100% - 60px);
  cursor: pointer;
`;

const FollowUsername = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline1};
`;

const FollowRecentWrap = styled.div`
  gap: 5px;
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
`;
const FollowRecentMsg = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey6};
  width: 70%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
`;
const FollowRecentSendTime = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey7};
  white-space: nowrap;
`;

const FollowUnreadWrap = styled.div`
  display: flex;
  justify-content: end;
`;

const FollowUnreadMsgCount = styled.div`
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

export default MessageInboxBody;
