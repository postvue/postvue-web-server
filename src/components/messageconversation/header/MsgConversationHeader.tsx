import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { NAVIGATION_TO } from '../../../const/AppConst';
import {
  MESSAGE_INBOX_PATH,
  PROFILE_LIST_PATH,
} from '../../../const/PathConst';
import {
  followInfoByMsgAtom,
  isSettingByMsgConversationAtom,
} from '../../../states/MessageAtom';
import { sessionActiveUserInfoHashMapAtom } from '../../../states/SessionAtom';
import theme from '../../../styles/theme';
import PrevButton from '../../PrevButton';

const MsgConversationHeader: React.FC = () => {
  const followInfo = useRecoilValue(followInfoByMsgAtom);
  const sessionActiveUserInfoHashMap = useRecoilValue(
    sessionActiveUserInfoHashMapAtom,
  );
  const setIsSettingByMsgConversation = useSetRecoilState(
    isSettingByMsgConversationAtom,
  );

  const onClickSetting = () => {
    setIsSettingByMsgConversation(true);
  };

  return (
    <MsgConversationHeaderContainer>
      <MsgProfileHeaderContainer>
        <PrevButtonWrap>
          <PrevButton
            style={PrevStyle}
            strokeColor={theme.mainColor.Black}
            to={MESSAGE_INBOX_PATH}
            type={NAVIGATION_TO}
          />
        </PrevButtonWrap>
        <FollowProfileInfoWrap>
          <Link to={`${PROFILE_LIST_PATH}/${followInfo.username}`}>
            <FollowProfileInfoLinkWrap>
              <FolowProfileActiveWrap>
                <FollowProfileImg src={followInfo.profilePath} />
                <FollowActive
                  $sessionState={
                    sessionActiveUserInfoHashMap.get(followInfo.targetUserId)
                      ?.sessionState || false
                  }
                />
              </FolowProfileActiveWrap>
              <FollowProfileNameWrap>
                <FollowProfileName>{followInfo.username}</FollowProfileName>
              </FollowProfileNameWrap>
            </FollowProfileInfoLinkWrap>
          </Link>
        </FollowProfileInfoWrap>
        <SettingButtonWrap>
          <SettingButton onClick={() => onClickSetting()}>
            <SettingButtonIcon
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M11.8319 4.5C11.5704 4.5 11.3196 4.60536 11.1347 4.79289C10.9498 4.98043 10.8459 5.23478 10.8459 5.5C10.8459 5.76522 10.9498 6.01957 11.1347 6.20711C11.3196 6.39464 11.5704 6.5 11.8319 6.5C12.0934 6.5 12.3442 6.39464 12.5291 6.20711C12.714 6.01957 12.8179 5.76522 12.8179 5.5C12.8179 5.23478 12.714 4.98043 12.5291 4.79289C12.3442 4.60536 12.0934 4.5 11.8319 4.5Z"
                fill="#26292C"
              />
              <path
                d="M11.8319 10.9999C11.5704 10.9999 11.3196 11.1053 11.1347 11.2928C10.9498 11.4804 10.8459 11.7347 10.8459 11.9999C10.8459 12.2651 10.9498 12.5195 11.1347 12.707C11.3196 12.8946 11.5704 12.9999 11.8319 12.9999C12.0934 12.9999 12.3442 12.8946 12.5291 12.707C12.714 12.5195 12.8179 12.2651 12.8179 11.9999C12.8179 11.7347 12.714 11.4804 12.5291 11.2928C12.3442 11.1053 12.0934 10.9999 11.8319 10.9999Z"
                fill="#26292C"
              />
              <path
                d="M11.8319 17.5C11.5704 17.5 11.3196 17.6054 11.1347 17.7929C10.9498 17.9804 10.8459 18.2348 10.8459 18.5C10.8459 18.7652 10.9498 19.0196 11.1347 19.2071C11.3196 19.3946 11.5704 19.5 11.8319 19.5C12.0934 19.5 12.3442 19.3946 12.5291 19.2071C12.714 19.0196 12.8179 18.7652 12.8179 18.5C12.8179 18.2348 12.714 17.9804 12.5291 17.7929C12.3442 17.6054 12.0934 17.5 11.8319 17.5Z"
                fill="#26292C"
              />
              <path
                d="M11.8319 4.5C11.5704 4.5 11.3196 4.60536 11.1347 4.79289C10.9498 4.98043 10.8459 5.23478 10.8459 5.5C10.8459 5.76522 10.9498 6.01957 11.1347 6.20711C11.3196 6.39464 11.5704 6.5 11.8319 6.5C12.0934 6.5 12.3442 6.39464 12.5291 6.20711C12.714 6.01957 12.8179 5.76522 12.8179 5.5C12.8179 5.23478 12.714 4.98043 12.5291 4.79289C12.3442 4.60536 12.0934 4.5 11.8319 4.5Z"
                stroke="#26292C"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.8319 10.9999C11.5704 10.9999 11.3196 11.1053 11.1347 11.2928C10.9498 11.4804 10.8459 11.7347 10.8459 11.9999C10.8459 12.2651 10.9498 12.5195 11.1347 12.707C11.3196 12.8946 11.5704 12.9999 11.8319 12.9999C12.0934 12.9999 12.3442 12.8946 12.5291 12.707C12.714 12.5195 12.8179 12.2651 12.8179 11.9999C12.8179 11.7347 12.714 11.4804 12.5291 11.2928C12.3442 11.1053 12.0934 10.9999 11.8319 10.9999Z"
                stroke="#26292C"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.8319 17.5C11.5704 17.5 11.3196 17.6054 11.1347 17.7929C10.9498 17.9804 10.8459 18.2348 10.8459 18.5C10.8459 18.7652 10.9498 19.0196 11.1347 19.2071C11.3196 19.3946 11.5704 19.5 11.8319 19.5C12.0934 19.5 12.3442 19.3946 12.5291 19.2071C12.714 19.0196 12.8179 18.7652 12.8179 18.5C12.8179 18.2348 12.714 17.9804 12.5291 17.7929C12.3442 17.6054 12.0934 17.5 11.8319 17.5Z"
                stroke="#26292C"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </SettingButtonIcon>
          </SettingButton>
        </SettingButtonWrap>
      </MsgProfileHeaderContainer>
      <ProfileBoundaryBarStick />
    </MsgConversationHeaderContainer>
  );
};

const MsgConversationHeaderContainer = styled.div``;

const MsgProfileHeaderContainer = styled.div`
  padding: 12px 16px 11px 20px;
  display: flex;
  height: 35px;
`;

const PrevButtonWrap = styled.div`
  display: flex;
`;
const PrevStyle: React.CSSProperties = {
  display: 'flex',
};

const FollowProfileInfoWrap = styled.div`
  display: flex;
  margin: auto 0;

  width: 100%;
`;

const FollowProfileInfoLinkWrap = styled.div`
  display: flex;
  gap: 10px;
`;

const FolowProfileActiveWrap = styled.div`
  position: relative;
`;

const FollowProfileImg = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 20px;
  vertical-align: bottom;
`;

const FollowActive = styled.div<{ $sessionState: boolean }>`
  background: ${(props) =>
    props.$sessionState ? theme.successColor.Green : theme.grey.Grey2};
  width: 8.5px;
  height: 8.5px;
  border-radius: 10px;
  border: 1px solid white;
  position: absolute;
  bottom: 0;
  right: 0px;
`;

const FollowProfileNameWrap = styled.div`
  display: flex;
`;
const FollowProfileName = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  margin: auto 0;
`;

const ProfileBoundaryBarStick = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.grey.Grey2};
`;

const SettingButtonWrap = styled.div`
  display: flex;
  cursor: pointer;
`;
const SettingButton = styled.div`
  display: flex;
  cursor: pointer;
`;

const SettingButtonIcon = styled.svg`
  margin: auto 0;
`;
export default MsgConversationHeader;
