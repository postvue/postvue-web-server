import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  isActivPostComposeBySourceUrlPopupAtom,
  isActivPostComposeSelectPopupAtom,
} from 'states/PostComposeAtom';
import {
  ACTIVE_CLASS_NAME,
  TABBAR_NAV_CLASS_NAME,
} from '../const/ClassNameConst';
import {
  EXPLORE_PATH,
  HOME_PATH,
  PROFILE_MY_ACCOUNT_ROUTE_PATH,
  PROFILE_SCRAP_LIST_PATH,
} from '../const/PathConst';
import PostComposeButton from './common/buttton/PostComposeButton';

import { ReactComponent as HomeTabActiveIcon } from 'assets/images/icon/svg/navbar/HomeTabActiveIconV2.svg';
import { ReactComponent as HomeTabNotActiveIcon } from 'assets/images/icon/svg/navbar/HomeTabNotActiveIcon.svg';
import { ReactComponent as MapTabActiveIcon } from 'assets/images/icon/svg/navbar/MapTabActiveIconV2.svg';
import { ReactComponent as MapTabNotActiveIcon } from 'assets/images/icon/svg/navbar/MapTabNotActiveIcon.svg';
import { ReactComponent as ProfileTabActiveIconByUnread } from 'assets/images/icon/svg/navbar/ProfileTabActiveIconByUnreadV2.svg';
import { ReactComponent as ProfileTabActiveIcon } from 'assets/images/icon/svg/navbar/ProfileTabActiveIconV2.svg';
import { ReactComponent as ProfileTabNotActiveIcon } from 'assets/images/icon/svg/navbar/ProfileTabNotActiveIcon.svg';
import { ReactComponent as ProfileTabNotActiveIconByUnread } from 'assets/images/icon/svg/navbar/ProfileTabNotActiveIconByUnread.svg';
import { ReactComponent as ScrapTabActiveIcon } from 'assets/images/icon/svg/navbar/ScrapTabActiveIconV2.svg';
import { ReactComponent as ScrapTabNotActiveIcon } from 'assets/images/icon/svg/navbar/ScrapTabNotActiveIcon.svg';
import {
  HOME_PAGE_NAME,
  isMainTab,
  MAP_PAGE_NAME,
  PROFILE_PAGE_NAME,
  SCRAP_PAGE_NAME,
} from 'const/ReactNativeConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { isUserLoggedIn } from 'global/util/AuthUtil';
import { fetchTasteForMeByNotChannel } from 'global/util/channel/static/fetchTasteForMeByNotChannel';
import {
  isApp,
  navigateToMainTab,
  navigateToTabWithUrl,
  sendVibrationLightEvent,
} from 'global/util/reactnative/nativeRouter';
import { useActiveUserSessionHookByIndexedDb } from 'hook/db/useActiveUserSessionHookByIndexedDb';
import { useSnsNotificationHookByIndexedDb } from 'hook/db/useSnsNotifcationHookByIndexedDb';
import { QueryStateMsgInboxListInfinite } from 'hook/queryhook/QueryStateMsgInboxListInfinite';
import { homeTabInfoAtom } from 'states/HomePageAtom';
import { sendedMsgListInfoAtom } from 'states/MessageAtom';
import { scrapTabInfoAtom } from 'states/ProfileAtom';

interface BottomNavBarProps {
  BottomNavBarContainerRef?: React.RefObject<HTMLDivElement>;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({
  BottomNavBarContainerRef,
}) => {
  const [selectedPath, setSelectedPath] = useState<string>();
  const { activeUserSessions } = useActiveUserSessionHookByIndexedDb();

  const setIsActivePostComposeSelectPopup = useSetRecoilState(
    isActivPostComposeSelectPopupAtom,
  );

  const setIsActivePostComposeBySourceUrlPopup = useSetRecoilState(
    isActivPostComposeBySourceUrlPopupAtom,
  );

  const { data: msgInboxMessageList } =
    QueryStateMsgInboxListInfinite(isUserLoggedIn());
  const sendedMsgListInfo = useRecoilValue(sendedMsgListInfoAtom);

  const { hasUnreadNotifications } = useSnsNotificationHookByIndexedDb();

  const [mainTabInfo, setHomeTabInfo] = useRecoilState(homeTabInfoAtom);
  const setScrapTabInfo = useSetRecoilState(scrapTabInfoAtom);

  useEffect(() => {
    return () => {
      setIsActivePostComposeSelectPopup(false);
      setIsActivePostComposeBySourceUrlPopup(false);
    };
  }, []);

  useEffect(() => {
    setSelectedPath(location.pathname);
  }, [location.pathname]);

  const navigate = useNavigate();

  return (
    <>
      <BottomNavBarContainer ref={BottomNavBarContainerRef}>
        <StyleActiveTab
          onClick={() => {
            sendVibrationLightEvent();
            if (isMainTab()) {
              navigateToTabWithUrl(navigate, MAP_PAGE_NAME, EXPLORE_PATH);
            } else {
              navigateToMainTab(navigate, MAP_PAGE_NAME, EXPLORE_PATH);
            }
          }}
        >
          {location.pathname === EXPLORE_PATH ? (
            <TabWrap>
              <TabSubWrap>
                <MapTabActiveIcon />
                {/* <ActiveTabText>{EXPLORE_TAB_NAME}</ActiveTabText> */}
              </TabSubWrap>
            </TabWrap>
          ) : (
            <TabWrap>
              <TabSubWrap>
                <MapTabNotActiveIcon />
                {/* <TabText>{EXPLORE_TAB_NAME}</TabText> */}
              </TabSubWrap>
            </TabWrap>
          )}
        </StyleActiveTab>
        <StyleActiveTab
          onClick={() => {
            sendVibrationLightEvent();
            if (isMainTab()) {
              if (location.pathname === HOME_PATH) {
                if (isApp()) {
                  setHomeTabInfo((prev) => ({
                    ...prev,
                    scrollInfo: { scroll: 0, isActive: true },
                  }));
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              } else {
                if (!isApp()) {
                  fetchTasteForMeByNotChannel();
                }
                navigateToTabWithUrl(navigate, HOME_PAGE_NAME, HOME_PATH);
              }
            } else {
              if (!isApp()) {
                fetchTasteForMeByNotChannel();
              }
              navigateToMainTab(navigate, HOME_PAGE_NAME, HOME_PATH);
            }
          }}
        >
          {location.pathname === HOME_PATH ? (
            <TabWrap>
              <TabSubWrap>
                <HomeTabActiveIcon />
                {/* <ActiveTabText>{FEED_TAB_NAME}</ActiveTabText> */}
              </TabSubWrap>
            </TabWrap>
          ) : (
            <TabWrap>
              <TabSubWrap>
                <HomeTabNotActiveIcon />
                {/* <TabText>{FEED_TAB_NAME}</TabText> */}
              </TabSubWrap>
            </TabWrap>
          )}
        </StyleActiveTab>
        <StyleActiveTab>
          <TabWrap>
            <TabSubWrap style={{ height: '4px' }}>
              <PostComposeButton />
            </TabSubWrap>
          </TabWrap>
        </StyleActiveTab>
        {/* @REFER: 메시지 개발 수정 시, */}
        {/* <StyleActiveTab
          onClick={() => {
            sendVibrationLightEvent();

            if (isMainTab()) {
              navigateToTabWithUrl(
                navigate,
                MESSAGE_PAGE_NAME,
                MESSAGE_INBOX_PATH,
              );
            } else {
              navigateToMainTab(
                navigate,
                MESSAGE_PAGE_NAME,
                MESSAGE_INBOX_PATH,
              );
            }
          }}
        >
          {selectedPath == MESSAGE_INBOX_PATH ? (
            <TabWrap>
              <TabSubWrap>
                {sendedMsgListInfo.unreadMsgNum > 0 ||
                Array.from(notificationMsgHashMap.entries()).some(
                  (value) => value[1].isRead === false,
                ) ||
                (msgInboxMessageList &&
                  msgInboxMessageList?.pages
                    .flatMap((v) => v)
                    .filter((v) => v.unreadCount > 0).length > 0) ? (
                  <MessageTabActiveIconByUnread />
                ) : (
                  <MessageTabActiveIcon />
                )}
                <ActiveTabText>메시지</ActiveTabText>
              </TabSubWrap>
            </TabWrap>
          ) : (
            <TabWrap>
              <TabSubWrap>
                {sendedMsgListInfo.unreadMsgNum > 0 ||
                Array.from(notificationMsgHashMap.entries()).some(
                  (value) => value[1].isRead === false,
                ) ||
                (msgInboxMessageList &&
                  msgInboxMessageList?.pages
                    .flatMap((v) => v)
                    .filter((v) => v.unreadCount > 0).length > 0) ? (
                  <MessageTabNotActiveIconByUnread />
                ) : (
                  <MessageTabNotActiveIcon />
                )}
                <TabText>메시지</TabText>
              </TabSubWrap>
            </TabWrap>
          )}
        </StyleActiveTab> */}

        <StyleActiveTab
          onClick={() => {
            sendVibrationLightEvent();

            if (isMainTab()) {
              if (location.pathname === PROFILE_SCRAP_LIST_PATH) {
                if (isApp()) {
                  setScrapTabInfo((prev) => ({
                    ...prev,
                    scrollInfo: { scroll: 0, isActive: true },
                  }));
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              } else {
                navigateToTabWithUrl(
                  navigate,
                  SCRAP_PAGE_NAME,
                  PROFILE_SCRAP_LIST_PATH,
                );
              }
            } else {
              navigateToMainTab(
                navigate,
                SCRAP_PAGE_NAME,
                PROFILE_SCRAP_LIST_PATH,
              );
            }
          }}
        >
          {selectedPath === PROFILE_SCRAP_LIST_PATH ? (
            <TabWrap>
              <TabSubWrap>
                <ScrapTabActiveIcon />

                {/* <ActiveTabText>스크랩</ActiveTabText> */}
              </TabSubWrap>
            </TabWrap>
          ) : (
            <TabWrap>
              <TabSubWrap>
                <ScrapTabNotActiveIcon />
                {/* <TabText>스크랩</TabText> */}
              </TabSubWrap>
            </TabWrap>
          )}
        </StyleActiveTab>
        <StyleActiveTab
          onClick={() => {
            sendVibrationLightEvent();

            if (isMainTab()) {
              if (location.pathname === PROFILE_MY_ACCOUNT_ROUTE_PATH) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigateToTabWithUrl(
                  navigate,
                  PROFILE_PAGE_NAME,
                  PROFILE_MY_ACCOUNT_ROUTE_PATH,
                );
              }
            } else {
              navigateToMainTab(
                navigate,
                PROFILE_PAGE_NAME,
                PROFILE_MY_ACCOUNT_ROUTE_PATH,
              );
            }
          }}
        >
          {selectedPath === PROFILE_MY_ACCOUNT_ROUTE_PATH ? (
            <TabWrap>
              <TabSubWrap>
                {hasUnreadNotifications ? (
                  <ProfileTabActiveIconByUnread />
                ) : (
                  <ProfileTabActiveIcon />
                )}
                {/* <ActiveTabText>프로필</ActiveTabText> */}
              </TabSubWrap>
            </TabWrap>
          ) : (
            <TabWrap>
              <TabSubWrap>
                {hasUnreadNotifications ? (
                  <ProfileTabNotActiveIconByUnread />
                ) : (
                  <ProfileTabNotActiveIcon />
                )}
                {/* <TabText>프로필</TabText> */}
              </TabSubWrap>
            </TabWrap>
          )}
        </StyleActiveTab>
      </BottomNavBarContainer>
    </>
  );
};

const BottomNavBarContainer = styled.div`
  z-index: 150;
  position: fixed;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  margin: 0px auto;
  height: 50px;
  background-color: white;
  // border-top: 1px solid ${({ theme }) => theme.grey.Grey2};
  border-radius: 15px 15px 0 0;
  box-shadow: 0 -5px 25px rgba(0, 0, 0, 0.05);

  display: flex;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    display: none;
  }
`;

const StyleTab = styled.div`
  .${ACTIVE_CLASS_NAME} {
    span {
      color: ${({ theme }) => theme.mainColor.Black};
    }
  }

  & > .${TABBAR_NAV_CLASS_NAME} {
    align-items: center;
    display: flex;
    flex-direction: column;
    text-decoration: none;
  }
  width: 60px;
`;

const StyleActiveTab = styled.div`
  width: 60px;
  display: flex;
`;

const TabWrap = styled.div`
  display: flex;

  margin: auto;
`;

const TabSubWrap = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  text-decoration: none;
  justify-content: center;
`;
const TabText = styled.span`
  // padding-top: 5px;
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey4};
`;

const ActiveTabText = styled(TabText)`
  // padding-top: 5px;
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.mainColor.Black};
`;

export default BottomNavBar;
