import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { PROFILE_LIST_PATH } from '../../../const/PathConst';
import {
  isSettingByMsgConversationAtom,
  profileInfoByDirectMsgAtom,
} from '../../../states/MessageAtom';
import theme from '../../../styles/theme';
import PrevButton from '../../PrevButton';

import { ReactComponent as SettingVerticalDotIcon } from 'assets/images/icon/svg/SettingVerticalDotIcon.svg';
import HeaderLayout from 'components/layouts/HeaderLayout';
import ContextMenuPopup from 'components/popups/ContextMenuPopup';
import {
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import { useActiveUserSessionHookByIndexedDb } from 'hook/db/useActiveUserSessionHookByIndexedDb';
import MsgConversationSettingPopupBody from '../popup/MsgConversationSettingPopupBody';

interface MsgConversationHeaderProps {
  MsgConversationHeaderStyle?: React.CSSProperties;
  MsgConversationHeaderSubStyle?: React.CSSProperties;
  isPrevButton?: boolean;
}

const MsgConversationHeader: React.FC<MsgConversationHeaderProps> = ({
  MsgConversationHeaderStyle,
  MsgConversationHeaderSubStyle,
  isPrevButton = true,
}) => {
  const msgSettingButtonRef = useRef<HTMLDivElement>(null);

  const profileInfoByDirectMsg = useRecoilValue(profileInfoByDirectMsgAtom);
  const { activeUserSessions } = useActiveUserSessionHookByIndexedDb();
  const navigate = useNavigate();
  const [isSettingByMsgConversation, setIsSettingByMsgConversation] =
    useRecoilState(isSettingByMsgConversationAtom);

  const onClickSetting = () => {
    setIsSettingByMsgConversation(true);
  };

  const { windowWidth } = useWindowSize();

  return (
    <MsgConversationHeaderContainer
      style={{ ...{ flexShrink: '0' }, ...MsgConversationHeaderStyle }}
    >
      <HeaderLayout
        HeaderLayoutStyle={{
          ...{
            paddingBottom: '5px',
            borderBottom: `1px solid ${theme.grey.Grey2}`,
            position: 'static',
          },
          ...MsgConversationHeaderSubStyle,
        }}
      >
        <MsgProfileHeaderContainer>
          <MsgProfileHeaderWrap>
            {isPrevButton && (
              <PrevButtonWrap>
                <PrevButton style={PrevStyle} />
              </PrevButtonWrap>
            )}
            <FollowProfileInfoWrap>
              <div
                onClick={() =>
                  navigate(
                    `${PROFILE_LIST_PATH}/${profileInfoByDirectMsg.username}`,
                  )
                }
              >
                <FollowProfileInfoLinkWrap>
                  <FolowProfileActiveWrap>
                    <FollowProfileImg
                      src={profileInfoByDirectMsg.profilePath}
                    />
                    <FollowActive
                      $sessionState={
                        activeUserSessions.find(
                          (v) => v.id === profileInfoByDirectMsg.targetUserId,
                        )?.sessionState || false
                      }
                    />
                  </FolowProfileActiveWrap>
                  <FollowProfileNameWrap>
                    <FollowNameWrap>
                      <FollowProfileNickname>
                        {profileInfoByDirectMsg.nickname}
                      </FollowProfileNickname>
                      <FollowProfileUsername>
                        @{profileInfoByDirectMsg.username}
                      </FollowProfileUsername>
                    </FollowNameWrap>
                  </FollowProfileNameWrap>
                </FollowProfileInfoLinkWrap>
              </div>
            </FollowProfileInfoWrap>
            <SettingButtonWrap>
              <SettingButton
                onClick={() => onClickSetting()}
                ref={msgSettingButtonRef}
              >
                <SettingVerticalDotIcon />
              </SettingButton>
              {windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM &&
                isSettingByMsgConversation &&
                msgSettingButtonRef.current && (
                  <ContextMenuPopup
                    contextMenuRef={msgSettingButtonRef.current}
                    onClose={() => setIsSettingByMsgConversation(false)}
                  >
                    <MsgConversationSettingPopupBody
                      MsgSettingContainerStyle={{ padding: '20px' }}
                      targetProfileInfo={profileInfoByDirectMsg}
                    />
                  </ContextMenuPopup>
                )}
            </SettingButtonWrap>
          </MsgProfileHeaderWrap>
        </MsgProfileHeaderContainer>
      </HeaderLayout>
    </MsgConversationHeaderContainer>
  );
};

const MsgConversationHeaderContainer = styled.div`
  width: 100%;
  position: fixed;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${theme.systemSize.appDisplaySize.widthByPc};
  }
  background-color: ${({ theme }) => theme.mainColor.White};
  z-index: 100;
`;

const MsgProfileHeaderContainer = styled.div`
  margin: auto 0px;
  display: flex;
  width: 100%;
`;

const MsgProfileHeaderWrap = styled.div`
  padding: 0 ${({ theme }) => theme.systemSize.header.paddingLeftRightMargin};
  margin: auto 0px;
  display: flex;
  width: 100%;
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
  margin: auto 0;
`;

const FollowProfileImg = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 20px;
  vertical-align: bottom;
  object-fit: cover;
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

const FollowNameWrap = styled.div`
  margin: auto 0;
`;

const FollowProfileUsername = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey6};
`;

const FollowProfileNickname = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead2};
`;

const SettingButtonWrap = styled.div`
  display: flex;
  cursor: pointer;
  position: relative;
`;
const SettingButton = styled.div`
  display: flex;
  cursor: pointer;
  margin: auto 0;
`;

export default MsgConversationHeader;
