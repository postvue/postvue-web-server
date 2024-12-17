import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { useRecoilValue, useSetRecoilState } from 'recoil';
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
  MESSAGE_INBOX_PATH,
  PROFILE_CLIP_LIST_PATH,
  PROFILE_SCRAP_LIST_PATH,
} from '../const/PathConst';
import PostComposeButton from './common/buttton/PostComposeButton';

import { ReactComponent as HomeTabActiveIcon } from 'assets/images/icon/svg/navbar/HomeTabActiveIcon.svg';
import { ReactComponent as HomeTabNotActiveIcon } from 'assets/images/icon/svg/navbar/HomeTabNotActiveIcon.svg';
import { ReactComponent as MapTabActiveIcon } from 'assets/images/icon/svg/navbar/MapTabActiveIcon.svg';
import { ReactComponent as MapTabNotActiveIcon } from 'assets/images/icon/svg/navbar/MapTabNotActiveIcon.svg';
import { ReactComponent as MessageTabActiveIcon } from 'assets/images/icon/svg/navbar/MessageTabActiveIcon.svg';
import { ReactComponent as MessageTabActiveIconByUnread } from 'assets/images/icon/svg/navbar/MessageTabActiveIconByUnread.svg';
import { ReactComponent as MessageTabNotActiveIcon } from 'assets/images/icon/svg/navbar/MessageTabNotActiveIcon.svg';
import { ReactComponent as MessageTabNotActiveIconByUnread } from 'assets/images/icon/svg/navbar/MessageTabNotActiveIconByUnread.svg';
import { ReactComponent as ProfileTabActiveIcon } from 'assets/images/icon/svg/navbar/ProfileTabActiveIcon.svg';
import { ReactComponent as ProfileTabNotActiveIcon } from 'assets/images/icon/svg/navbar/ProfileTabNotActiveIcon.svg';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { isUserLoggedIn } from 'global/util/AuthUtil';
import { QueryStateMsgInboxListInfinite } from 'hook/queryhook/QueryStateMsgInboxListInfinite';
import { sendedMsgListInfoAtom } from 'states/MessageAtom';
import { notificationMsgHashMapAtom } from 'states/NotificationAtom';
import { isPostDetailInfoPopupAtom } from 'states/PostAtom';

interface BottomNavBarProps {
  BottomNavBarContainerRef?: React.RefObject<HTMLDivElement>;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({
  BottomNavBarContainerRef,
}) => {
  const [selectedPath, setSelectedPath] = useState<string>();

  const setIsActivePostComposeSelectPopup = useSetRecoilState(
    isActivPostComposeSelectPopupAtom,
  );

  const setIsPostDetailInfoPopup = useSetRecoilState(isPostDetailInfoPopupAtom);

  const setIsActivePostComposeBySourceUrlPopup = useSetRecoilState(
    isActivPostComposeBySourceUrlPopupAtom,
  );

  const { data: msgInboxMessageList } =
    QueryStateMsgInboxListInfinite(isUserLoggedIn());
  const sendedMsgListInfo = useRecoilValue(sendedMsgListInfoAtom);
  const notificationMsgHashMap = useRecoilValue(notificationMsgHashMapAtom);

  const onClickNavTab = () => {
    setIsPostDetailInfoPopup(false);
  };

  useEffect(() => {
    return () => {
      setIsActivePostComposeSelectPopup(false);
      setIsActivePostComposeBySourceUrlPopup(false);
    };
  }, []);

  useEffect(() => {
    setSelectedPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <BottomNavBarContainer ref={BottomNavBarContainerRef}>
        <StyleTab
          onClick={() => {
            onClickNavTab();
          }}
        >
          <NavLink
            to={HOME_PATH}
            className={({ isActive }) => {
              return (
                (isActive ? ACTIVE_CLASS_NAME : '') +
                ` ${TABBAR_NAV_CLASS_NAME}`
              );
            }}
          >
            {selectedPath == HOME_PATH ? (
              <HomeTabActiveIcon />
            ) : (
              <HomeTabNotActiveIcon />
            )}

            <TabText>홈피드</TabText>
          </NavLink>
        </StyleTab>
        <StyleTab>
          <NavLink
            to={EXPLORE_PATH}
            className={({ isActive }) => {
              return (
                (isActive ? ACTIVE_CLASS_NAME : '') +
                ` ${TABBAR_NAV_CLASS_NAME}`
              );
            }}
          >
            {selectedPath == EXPLORE_PATH ? (
              <MapTabActiveIcon />
            ) : (
              <MapTabNotActiveIcon />
            )}
            <TabText>탐색</TabText>
          </NavLink>
        </StyleTab>
        <StyleTab>
          <PostComposeButton />
        </StyleTab>
        <StyleTab>
          <NavLink
            to={MESSAGE_INBOX_PATH}
            className={({ isActive }) => {
              return (
                (isActive ? ACTIVE_CLASS_NAME : '') +
                ` ${TABBAR_NAV_CLASS_NAME}`
              );
            }}
          >
            {selectedPath == MESSAGE_INBOX_PATH ? (
              <>
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
              </>
            ) : (
              <>
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
              </>
            )}
            <TabText>메시지</TabText>
          </NavLink>
        </StyleTab>

        <StyleTab>
          <NavLink
            to={PROFILE_CLIP_LIST_PATH}
            className={({ isActive }) => {
              return (
                (isActive ? ACTIVE_CLASS_NAME : '') +
                ` ${TABBAR_NAV_CLASS_NAME}`
              );
            }}
          >
            {selectedPath === PROFILE_CLIP_LIST_PATH ||
            selectedPath === PROFILE_SCRAP_LIST_PATH ? (
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
          </NavLink>
        </StyleTab>
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
  padding: 10px 0 10px 0;
  background-color: white;
  border-top: 1px solid ${({ theme }) => theme.grey.Grey2};

  display: flex;
  justify-content: space-around;

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

const TabText = styled.span`
  padding-top: 5px;
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey4};
`;

const ActiveTabText = styled(TabText)`
  padding-top: 5px;
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.mainColor.Black};
`;

export default BottomNavBar;
