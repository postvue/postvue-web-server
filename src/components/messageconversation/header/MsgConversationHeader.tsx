import BoundaryStickBar from 'components/common/container/BoundaryStickBar';
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

import { ReactComponent as SettingVerticalDotIcon } from 'assets/images/icon/svg/SettingVerticalDotIcon.svg';

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
            <SettingVerticalDotIcon />
          </SettingButton>
        </SettingButtonWrap>
      </MsgProfileHeaderContainer>
      <BoundaryStickBar />
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

const SettingButtonWrap = styled.div`
  display: flex;
  cursor: pointer;
`;
const SettingButton = styled.div`
  display: flex;
  cursor: pointer;
  margin: auto 0;
`;

export default MsgConversationHeader;
