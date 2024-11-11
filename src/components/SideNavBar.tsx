import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  isActivPostComposeBySourceUrlPopupAtom,
  isActivPostComposePopupAtom,
} from 'states/PostComposeAtom';
import {
  ACTIVE_CLASS_NAME,
  TABBAR_NAV_CLASS_NAME,
} from '../const/ClassNameConst';
import {
  EXPLORE_PATH,
  HOME_PATH,
  INVALID_URL,
  MESSAGE_INBOX_PATH,
  NOTIFICATION_LIST_PATH,
  PROFILE_CLIP_LIST_PATH,
  PROFILE_SCRAP_LIST_PATH,
  PROFILE_SETTING_PATH,
} from '../const/PathConst';

import { ReactComponent as FeelogLogo } from 'assets/images/icon/svg/pc/FeelogLogo.svg';
import { ReactComponent as FeelogSmallLogo } from 'assets/images/icon/svg/pc/FeelogSmallLogo.svg';
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
import {
  MEDIA_MIDDLE_1300_WIDTH,
  MEDIA_MIDDLE_1300_WIDTH_NUM,
  MEDIA_MOBILE_MAX_WIDTH,
} from 'const/SystemAttrConst';
import LongPressToResizeButton from './common/buttton/LongPressToResizeButton';
import PostComposeButton from './common/buttton/PostComposeButton';
import WindowResizeSenceComponent from './common/container/WindowResizeSenseComponent';

const SideNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState<string>(
    location.pathname || INVALID_URL,
  );

  const setIsActivePostComposePopup = useSetRecoilState(
    isActivPostComposePopupAtom,
  );

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

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  return (
    <>
      <HeaderSidebarWrap>
        <HeaderSidebarLogoWrap onClick={() => navigate(HOME_PATH)}>
          <LongPressToResizeButton resize={0.85} resizeSpeedRate={0.3}>
            {windowSize.width >= MEDIA_MIDDLE_1300_WIDTH_NUM ? (
              <FeelogLogo />
            ) : (
              <FeelogSmallLogo />
            )}
          </LongPressToResizeButton>
        </HeaderSidebarLogoWrap>
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
                <NavTab>
                  {selectedPath == HOME_PATH ? (
                    <HomeTabActiveIcon />
                  ) : (
                    <HomeTabNotActiveIcon />
                  )}
                  <TabText>홈피드</TabText>
                </NavTab>
              </TabWrap>
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
              <TabWrap>
                <NavTab>
                  {selectedPath == EXPLORE_PATH ? (
                    <MapTabActiveIcon />
                  ) : (
                    <MapTabNotActiveIcon />
                  )}
                  <TabText>탐색</TabText>
                </NavTab>
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
                <NavTab>
                  {selectedPath == MESSAGE_INBOX_PATH ? (
                    <MessageTabActiveIcon />
                  ) : (
                    <MessageTabNotActiveIcon />
                  )}
                  <TabText>메시지</TabText>
                </NavTab>
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
                <NavTab>
                  {selectedPath == NOTIFICATION_LIST_PATH ? (
                    <AlarmTabActiveIcon />
                  ) : (
                    <AlarmTabNotActiveIcon />
                  )}
                  <TabText>알림</TabText>
                </NavTab>
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
                <NavTab>
                  {selectedPath === PROFILE_CLIP_LIST_PATH ||
                  selectedPath === PROFILE_SCRAP_LIST_PATH ? (
                    <ProfileTabActiveIcon />
                  ) : (
                    <ProfileTabNotActiveIcon />
                  )}
                  <TabText>프로필</TabText>
                </NavTab>
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
                <NavTab>
                  {selectedPath.startsWith(PROFILE_SETTING_PATH) ? (
                    <AccountSettingActiveIcon />
                  ) : (
                    <AccountSettingNotActiveIcon />
                  )}
                  <TabText>설정</TabText>
                </NavTab>
              </TabWrap>
            </NavLink>
          </StyleTab>
        </Container>
        <PoseComposeButtonWrap>
          {windowSize.width >= MEDIA_MIDDLE_1300_WIDTH_NUM ? (
            <PoseComposeButton
              onClick={(e) => {
                e.stopPropagation();
                setIsActivePostComposePopup(true);
              }}
            >
              게시하기
            </PoseComposeButton>
          ) : (
            <PostComposeButton />
          )}
        </PoseComposeButtonWrap>
      </HeaderSidebarWrap>
      <WindowResizeSenceComponent setWindowSize={setWindowSize} />
    </>
  );
};

const sizeLeftMarginNum = 8;
const sizeLeftMargin = `${sizeLeftMarginNum}px`;

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
  padding: 8px 45px;
  background-color: ${({ theme }) => theme.mainColor.Blue};
  color: ${({ theme }) => theme.mainColor.White};
  border-radius: 30px;
  cursor: pointer;
`;

export default SideNavBar;
