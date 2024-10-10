import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { useRecoilState } from 'recoil';
import {
  isActivPostComposeBySourceUrlPopupAtom,
  isActivPostComposePopupAtom,
} from 'states/PostComposeAtom';
import {
  ACTIVE_CLASS_NAME,
  TABBAR_NAV_CLASS_NAME,
} from '../const/ClassNameConst';
import {
  HOME_PATH,
  INVALID_URL,
  MAP_PATH,
  MESSAGE_INBOX_PATH,
  NOTIFICATION_LIST_PATH,
  PROFILE_CLIP_LIST_PATH,
  PROFILE_SCRAP_LIST_PATH,
  PROFILE_SETTING_PATH,
} from '../const/PathConst';
import PostComposeBySourceUrlPopup from './popups/postcompose/PostComposeBySourceUrlPopup';
import PostComposePopup from './popups/postcompose/PostComposePopup';

import { ReactComponent as AccountSettingActiveIcon } from 'assets/images/icon/svg/pc/navbar/AccountSettingActiveIcon.svg';
import { ReactComponent as AccountSettingNotActiveIcon } from 'assets/images/icon/svg/pc/navbar/AccountSettingNotActiveIcon.svg';
import { ReactComponent as AlarmTabActiveIcon } from 'assets/images/icon/svg/pc/navbar/AlarmTabActiveIcon.svg';
import { ReactComponent as AlarmTabNotActiveIcon } from 'assets/images/icon/svg/pc/navbar/AlarmTabNotActiveIcon.svg';
import { ReactComponent as HomeTabActiveIcon } from 'assets/images/icon/svg/pc/navbar/HomeTabActiveIcon.svg';
import { ReactComponent as HomeTabNotActiveIcon } from 'assets/images/icon/svg/pc/navbar/HomeTabNotActiveIcon.svg';
import { ReactComponent as MapTabActiveIcon } from 'assets/images/icon/svg/pc/navbar/MapTabActiveIcon.svg';
import { ReactComponent as MapTabNotActiveIcon } from 'assets/images/icon/svg/pc/navbar/MapTabNotActiveIcon.svg';
import { ReactComponent as MessageTabActiveIcon } from 'assets/images/icon/svg/pc/navbar/MessageTabActiveIcon.svg';
import { ReactComponent as MessageTabNotActiveIcon } from 'assets/images/icon/svg/pc/navbar/MessageTabNotActiveIcon.svg';
import { ReactComponent as ProfileTabActiveIcon } from 'assets/images/icon/svg/pc/navbar/ProfileTabActiveIcon.svg';
import { ReactComponent as ProfileTabNotActiveIcon } from 'assets/images/icon/svg/pc/navbar/ProfileTabNotActiveIcon.svg';

const SideNavBar: React.FC = () => {
  const location = useLocation();
  const [selectedPath, setSelectedPath] = useState<string>(
    location.pathname || INVALID_URL,
  );

  const [isActivePostComposePopup, setIsActivePostComposePopup] =
    useRecoilState(isActivPostComposePopupAtom);

  const [
    isActivePostComposeBySourceUrlPopup,
    setIsActivePostComposeBySourceUrlPopup,
  ] = useRecoilState(isActivPostComposeBySourceUrlPopupAtom);

  useEffect(() => {
    setSelectedPath(location.pathname);
    return () => {
      setIsActivePostComposePopup(false);
      setIsActivePostComposeBySourceUrlPopup(false);
    };
  }, []);

  return (
    <>
      <Container>
        <StyleTab>
          <NavLink
            to={HOME_PATH}
            className={({ isActive }) => {
              return (
                (isActive ? ACTIVE_CLASS_NAME : '') +
                ` ${TABBAR_NAV_CLASS_NAME}`
              );
            }}
          >
            <TabWrap>
              {selectedPath == HOME_PATH ? (
                <HomeTabActiveIcon />
              ) : (
                <HomeTabNotActiveIcon />
              )}
              <TabText>홈피드</TabText>
            </TabWrap>
          </NavLink>
        </StyleTab>
        <StyleTab>
          <NavLink
            to={MAP_PATH}
            className={({ isActive }) => {
              return (
                (isActive ? ACTIVE_CLASS_NAME : '') +
                ` ${TABBAR_NAV_CLASS_NAME}`
              );
            }}
          >
            <TabWrap>
              {selectedPath == MAP_PATH ? (
                <MapTabActiveIcon />
              ) : (
                <MapTabNotActiveIcon />
              )}
              <TabText>탐색</TabText>
            </TabWrap>
          </NavLink>
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
            <TabWrap>
              {selectedPath == MESSAGE_INBOX_PATH ? (
                <MessageTabActiveIcon />
              ) : (
                <MessageTabNotActiveIcon />
              )}
              <TabText>메시지</TabText>
            </TabWrap>
          </NavLink>
        </StyleTab>

        <StyleTab>
          <NavLink
            to={NOTIFICATION_LIST_PATH}
            className={({ isActive }) => {
              return (
                (isActive ? ACTIVE_CLASS_NAME : '') +
                ` ${TABBAR_NAV_CLASS_NAME}`
              );
            }}
          >
            <TabWrap>
              {selectedPath == NOTIFICATION_LIST_PATH ? (
                <AlarmTabActiveIcon />
              ) : (
                <AlarmTabNotActiveIcon />
              )}
              <TabText>알림</TabText>
            </TabWrap>
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
            <TabWrap>
              {selectedPath === PROFILE_CLIP_LIST_PATH ||
              selectedPath === PROFILE_SCRAP_LIST_PATH ? (
                <ProfileTabActiveIcon />
              ) : (
                <ProfileTabNotActiveIcon />
              )}
              <TabText>프로필</TabText>
            </TabWrap>
          </NavLink>
        </StyleTab>
        <StyleTab>
          <NavLink
            to={PROFILE_SETTING_PATH}
            className={({ isActive }) => {
              return (
                (isActive ? ACTIVE_CLASS_NAME : '') +
                ` ${TABBAR_NAV_CLASS_NAME}`
              );
            }}
          >
            <TabWrap>
              {selectedPath.startsWith(PROFILE_SETTING_PATH) ? (
                <AccountSettingActiveIcon />
              ) : (
                <AccountSettingNotActiveIcon />
              )}
              <TabText>설정</TabText>
            </TabWrap>
          </NavLink>
        </StyleTab>
      </Container>
      {isActivePostComposePopup && <PostComposePopup />}
      {isActivePostComposeBySourceUrlPopup && <PostComposeBySourceUrlPopup />}
    </>
  );
};

const Container = styled.div`
  z-index: 10;

  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};

  width: 100%;
  margin: 0px auto;
  padding: 10px 0 3vh 0;
  background-color: white;

  display: flex;
  flex-flow: column;
  gap: 50px;
  // position: fixed;
`;

const StyleTab = styled.div`
  .${ACTIVE_CLASS_NAME} {
    span {
      color: ${({ theme }) => theme.mainColor.Black};
    }
  }

  & > .${TABBAR_NAV_CLASS_NAME} {
    display: flex;
    flex-direction: column;
    text-decoration: none;
  }
`;

const TabWrap = styled.div`
  display: flex;
  gap: 7px;
`;

const TabText = styled.span`
  font: ${({ theme }) => theme.fontSizes.Headline1};
  color: ${({ theme }) => theme.grey.Grey4};
  white-space: nowrap;
  margin: auto 0px;
`;

export default SideNavBar;
