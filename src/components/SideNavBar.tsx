import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  isActivPostComposeBySourceUrlPopupAtom,
  isActivPostComposeSelectPopupAtom,
} from 'states/PostComposeAtom';
import { TABBAR_NAV_CLASS_NAME } from '../const/ClassNameConst';
import {
  EXPLORE_PATH,
  HOME_PATH,
  INVALID_URL,
  NOTIFICATION_LIST_PATH,
  PROFILE_MY_ACCOUNT_ROUTE_PATH,
  PROFILE_SCRAP_LIST_PATH,
  PROFILE_SETTING_PATH,
} from '../const/PathConst';

import { ReactComponent as FeelogLargeLogo } from 'assets/images/icon/svg/logo/FeelogLargeLogo.svg';
import { ReactComponent as AccountSettingActiveIcon } from 'assets/images/icon/svg/pc/navbar/AccountSettingActiveIcon.svg';
import { ReactComponent as AccountSettingNotActiveIcon } from 'assets/images/icon/svg/pc/navbar/AccountSettingNotActiveIcon.svg';
import { ReactComponent as HomeTabActiveIcon } from 'assets/images/icon/svg/pc/navbar/HomeTabActiveIcon.svg';
import { ReactComponent as HomeTabNotActiveIcon } from 'assets/images/icon/svg/pc/navbar/HomeTabNotActiveIcon.svg';
import { ReactComponent as MapTabActiveIcon } from 'assets/images/icon/svg/pc/navbar/MapTabActiveIcon.svg';
import { ReactComponent as MapTabNotActiveIcon } from 'assets/images/icon/svg/pc/navbar/MapTabNotActiveIcon.svg';
import { ReactComponent as NotificationActiveIcon } from 'assets/images/icon/svg/pc/navbar/NotificationActiveIcon.svg';
import { ReactComponent as NotificationActiveIconByUnread } from 'assets/images/icon/svg/pc/navbar/NotificationActiveIconByUnread.svg';
import { ReactComponent as NotificationNotActiveIcon } from 'assets/images/icon/svg/pc/navbar/NotificationNotActiveIcon.svg';
import { ReactComponent as NotificationNotActiveIconByUnread } from 'assets/images/icon/svg/pc/navbar/NotificationNotActiveIconByUnread.svg';
import { ReactComponent as ProfileTabActiveIcon } from 'assets/images/icon/svg/pc/navbar/ProfileTabActiveIcon.svg';
import { ReactComponent as ProfileTabNotActiveIcon } from 'assets/images/icon/svg/pc/navbar/ProfileTabNotActiveIcon.svg';
import { ReactComponent as ScrapTabActiveIcon } from 'assets/images/icon/svg/pc/navbar/ScrapTabActiveIcon.svg';
import { ReactComponent as ScrapTabNotActiveIcon } from 'assets/images/icon/svg/pc/navbar/ScrapTabNotActiveIcon.svg';

import {
  MEDIA_MIDDLE_1300_WIDTH,
  MEDIA_MIDDLE_1300_WIDTH_NUM,
  MEDIA_MIDDLE_1400_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH,
} from 'const/SystemAttrConst';
import {
  EXPLORE_TAB_NAME,
  FEED_TAB_NAME,
  NOTIFICATION_TAB_NAME,
  SETTING_TAB_NAME,
} from 'const/TabConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import { useSnsNotificationHookByIndexedDb } from 'hook/db/useSnsNotifcationHookByIndexedDb';
import { QueryStateMsgInboxListInfinite } from 'hook/queryhook/QueryStateMsgInboxListInfinite';
import { sendedMsgListInfoAtom } from 'states/MessageAtom';
import { filterBrigntnessStyle } from 'styles/commonStyles';
import LongPressToResizeButton from './common/buttton/LongPressToResizeButton';
import PostComposeButton from './common/buttton/PostComposeButton';

interface SideNavBarProps {
  headerWidth: number;
}

const SideNavBar: React.FC<SideNavBarProps> = ({ headerWidth }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState<string>(
    location.pathname || INVALID_URL,
  );

  const setIsActivePostComposeSelectPopup = useSetRecoilState(
    isActivPostComposeSelectPopupAtom,
  );

  const setIsActivePostComposeBySourceUrlPopup = useSetRecoilState(
    isActivPostComposeBySourceUrlPopupAtom,
  );
  const { data: msgInboxMessageList } = QueryStateMsgInboxListInfinite();
  const sendedMsgListInfo = useRecoilValue(sendedMsgListInfoAtom);
  const { hasUnreadNotifications } = useSnsNotificationHookByIndexedDb();

  useEffect(() => {
    setSelectedPath(location.pathname);

    return () => {
      setIsActivePostComposeSelectPopup(false);
      setIsActivePostComposeBySourceUrlPopup(false);
    };
  }, []);

  const { windowWidth } = useWindowSize();

  return (
    <>
      <Header $headerWidth={headerWidth}>
        <HeaderWrap>
          <HeaderSidebarWrap>
            <HeaderSidebarLogoWrap onClick={() => navigate(HOME_PATH)}>
              <LongPressToResizeButton resize={0.99} resizeSpeedRate={0.1}>
                <FeelogLargeLogo />
              </LongPressToResizeButton>
            </HeaderSidebarLogoWrap>
            <Container>
              <StyleTab>
                <NavLink to={HOME_PATH}>
                  <TabWrap>
                    <NavTab>
                      {selectedPath === HOME_PATH ? (
                        <>
                          <HomeTabActiveIcon />
                          <ActiveTabText>{FEED_TAB_NAME}</ActiveTabText>
                        </>
                      ) : (
                        <>
                          <HomeTabNotActiveIcon />
                          <TabText>{FEED_TAB_NAME}</TabText>
                        </>
                      )}
                    </NavTab>
                  </TabWrap>
                </NavLink>
              </StyleTab>

              <StyleTab>
                <NavLink to={EXPLORE_PATH}>
                  <TabWrap>
                    <NavTab>
                      {selectedPath === EXPLORE_PATH ? (
                        <>
                          <MapTabActiveIcon />
                          <ActiveTabText>{EXPLORE_TAB_NAME}</ActiveTabText>
                        </>
                      ) : (
                        <>
                          <MapTabNotActiveIcon />
                          <TabText>{EXPLORE_TAB_NAME}</TabText>
                        </>
                      )}
                    </NavTab>
                  </TabWrap>
                </NavLink>
              </StyleTab>

              {/* <StyleTab>
                <NavLink
                  to={MESSAGE_INBOX_CONVERSATION_ROUTE_PATH}
                  className={({ isActive }) => {
                    return (
                      (isActive ? ACTIVE_CLASS_NAME : '') +
                      ` ${TABBAR_NAV_CLASS_NAME}`
                    );
                  }}
                >
                  <TabWrap>
                    <NavTab>
                      {selectedPath.startsWith(MESSAGE_PATH) ? (
                        <>
                          {sendedMsgListInfo.unreadMsgNum > 0 ||
                            (msgInboxMessageList &&
                            msgInboxMessageList?.pages
                              .flatMap((v) => v)
                              .filter((v) => v.unreadCount > 0).length > 0 ? (
                              <MessageTabActiveIconByUnread />
                            ) : (
                              <MessageTabActiveIcon />
                            ))}
                        </>
                      ) : (
                        <>
                          {sendedMsgListInfo.unreadMsgNum > 0 ||
                            (msgInboxMessageList &&
                            msgInboxMessageList?.pages
                              .flatMap((v) => v)
                              .filter((v) => v.unreadCount > 0).length > 0 ? (
                              <MessageTabNotActiveIconByUnread />
                            ) : (
                              <MessageTabNotActiveIcon />
                            ))}
                        </>
                      )}
                      <TabText>메시지</TabText>
                    </NavTab>
                  </TabWrap>
                </NavLink>
              </StyleTab> */}
              <StyleTab>
                <NavLink to={PROFILE_SCRAP_LIST_PATH}>
                  <TabWrap>
                    <NavTab>
                      {selectedPath === PROFILE_SCRAP_LIST_PATH ? (
                        <>
                          <ScrapTabActiveIcon />
                          <ActiveTabText>스크랩</ActiveTabText>
                        </>
                      ) : (
                        <>
                          <ScrapTabNotActiveIcon />
                          <TabText>스크랩</TabText>
                        </>
                      )}
                    </NavTab>
                  </TabWrap>
                </NavLink>
              </StyleTab>
              <StyleTab>
                <NavLink to={PROFILE_MY_ACCOUNT_ROUTE_PATH}>
                  <TabWrap>
                    <NavTab>
                      {selectedPath === PROFILE_MY_ACCOUNT_ROUTE_PATH ? (
                        <>
                          <ProfileTabActiveIcon />
                          <ActiveTabText>프로필</ActiveTabText>
                        </>
                      ) : (
                        <>
                          <ProfileTabNotActiveIcon />
                          <TabText>프로필</TabText>
                        </>
                      )}
                    </NavTab>
                  </TabWrap>
                </NavLink>
              </StyleTab>

              <StyleTab>
                <NavLink to={NOTIFICATION_LIST_PATH}>
                  <TabWrap>
                    <NavTab>
                      {selectedPath === NOTIFICATION_LIST_PATH ? (
                        <>
                          <>
                            {hasUnreadNotifications ? (
                              <NotificationActiveIconByUnread />
                            ) : (
                              <NotificationActiveIcon />
                            )}
                          </>
                          <ActiveTabText>{NOTIFICATION_TAB_NAME}</ActiveTabText>
                        </>
                      ) : (
                        <>
                          <>
                            {hasUnreadNotifications ? (
                              <NotificationNotActiveIconByUnread />
                            ) : (
                              <NotificationNotActiveIcon />
                            )}
                          </>
                          <TabText>{NOTIFICATION_TAB_NAME}</TabText>
                        </>
                      )}
                    </NavTab>
                  </TabWrap>
                </NavLink>
              </StyleTab>

              <StyleTab>
                <NavLink to={PROFILE_SETTING_PATH}>
                  <TabWrap>
                    <NavTab>
                      {selectedPath.startsWith(PROFILE_SETTING_PATH) ? (
                        <>
                          <AccountSettingActiveIcon />
                          <ActiveTabText>{SETTING_TAB_NAME}</ActiveTabText>
                        </>
                      ) : (
                        <>
                          <AccountSettingNotActiveIcon />
                          <TabText>{SETTING_TAB_NAME}</TabText>
                        </>
                      )}
                    </NavTab>
                  </TabWrap>
                </NavLink>
              </StyleTab>
            </Container>
            <PoseComposeButtonWrap>
              {windowWidth >= MEDIA_MIDDLE_1300_WIDTH_NUM ? (
                <PoseComposeButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsActivePostComposeSelectPopup(true);
                  }}
                >
                  게시하기
                </PoseComposeButton>
              ) : (
                <PostComposeButton />
              )}
            </PoseComposeButtonWrap>
          </HeaderSidebarWrap>
        </HeaderWrap>
      </Header>
    </>
  );
};

const sizeLeftMarginNum = 8;
const sizeLeftMargin = `${sizeLeftMarginNum}px`;

const Header = styled.header<{ $headerWidth: number }>`
  height: 100dvh;
  width: 100%;
  display: flex;

  @media ((min-width: ${MEDIA_MOBILE_MAX_WIDTH}) and (max-width: ${MEDIA_MIDDLE_1400_WIDTH})) {
    padding-left: 50px;
    width: 150px;
  }
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    width: 150px;
  }

  @media (min-width: ${MEDIA_MIDDLE_1400_WIDTH}) {
    justify-content: center;
    min-width: ${(props) => props.$headerWidth - 100}px;
    max-width: ${(props) => props.$headerWidth - 100}px;
  }
`;

const HeaderWrap = styled.div`
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  position: fixed;
`;

const HeaderSidebarWrap = styled.div`
  display: flex;
  flex-flow: column;
  gap: 50px;
  height: 100%;
`;

const Container = styled.div`
  z-index: 10;

  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};

  width: 100%;
  margin: 0px auto;
  padding: 10px 0 3vh 0;
  background-color: white;

  display: flex;
  flex-flow: column;
  gap: calc(50px - ${sizeLeftMargin});
  // position: fixed;
`;

const StyleTab = styled.div`
  & > .${TABBAR_NAV_CLASS_NAME} {
    display: flex;
    flex-direction: column;
    text-decoration: none;
  }
`;

const TabWrap = styled.div`
  display: flex;
`;

const NavTab = styled.div`
  gap: 7px;
  display: flex;

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    padding: ${sizeLeftMargin} ${sizeLeftMarginNum + 2}px;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    padding: ${sizeLeftMargin};
  }

  &:hover {
    border-radius: 30px;

    background-color: rgba(0, 0, 0, 0.06);
  }
`;

const TabText = styled.span`
  font: ${({ theme }) => theme.fontSizes.Headline1};
  color: ${({ theme }) => theme.grey.Grey4};
  white-space: nowrap;
  margin: auto 0px;

  @media (max-width: ${MEDIA_MIDDLE_1300_WIDTH}) {
    display: none;
  }
`;

const ActiveTabText = styled(TabText)`
  color: black;
`;

const HeaderSidebarLogoWrap = styled.div`
  padding-top: 10px;
  cursor: pointer;
  padding-left: ${sizeLeftMargin};
`;

const PoseComposeButtonWrap = styled.div`
  margin-bottom: ${({ theme }) =>
    theme.systemSize.appDisplaySize.bottomButtonMargin};
  margin-top: auto;
`;

const PoseComposeButton = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline2};
  padding: 8px 38px;
  background-color: ${({ theme }) => theme.mainColor.Blue};
  color: ${({ theme }) => theme.mainColor.White};
  border-radius: 30px;
  cursor: pointer;
  ${filterBrigntnessStyle}
`;

export default SideNavBar;
