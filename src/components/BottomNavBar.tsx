import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
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
  MESSAGE_INBOX_PATH,
  PROFILE_CLIP_LIST_PATH,
  PROFILE_SCRAP_LIST_PATH,
} from '../const/PathConst';
import PostComposeButton from './common/buttton/PostComposeButton';
import PostComposeBySourceUrlPopup from './popups/postcompose/PostComposeBySourceUrlPopup';
import PostComposePopup from './popups/postcompose/PostComposePopup';

import { ReactComponent as HomeTabActiveIcon } from 'assets/images/icon/svg/navbar/HomeTabActiveIcon.svg';
import { ReactComponent as HomeTabNotActiveIcon } from 'assets/images/icon/svg/navbar/HomeTabNotActiveIcon.svg';
import { ReactComponent as MapTabActiveIcon } from 'assets/images/icon/svg/navbar/MapTabActiveIcon.svg';
import { ReactComponent as MapTabNotActiveIcon } from 'assets/images/icon/svg/navbar/MapTabNotActiveIcon.svg';
import { ReactComponent as MessageTabActiveIcon } from 'assets/images/icon/svg/navbar/MessageTabActiveIcon.svg';
import { ReactComponent as MessageTabNotActiveIcon } from 'assets/images/icon/svg/navbar/MessageTabNotActiveIcon.svg';
import { ReactComponent as ProfileTabActiveIcon } from 'assets/images/icon/svg/navbar/ProfileTabActiveIcon.svg';
import { ReactComponent as ProfileTabNotActiveIcon } from 'assets/images/icon/svg/navbar/ProfileTabNotActiveIcon.svg';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { isPostDetailInfoPopupAtom } from 'states/PostAtom';

interface BottomNavBarProps {
  BottomNavBarContainerRef?: React.RefObject<HTMLDivElement>;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({
  BottomNavBarContainerRef,
}) => {
  const [selectedPath, setSelectedPath] = useState<string>();

  const [isActivePostComposePopup, setIsActivePostComposePopup] =
    useRecoilState(isActivPostComposePopupAtom);

  const setIsPostDetailInfoPopup = useSetRecoilState(isPostDetailInfoPopupAtom);

  const [
    isActivePostComposeBySourceUrlPopup,
    setIsActivePostComposeBySourceUrlPopup,
  ] = useRecoilState(isActivPostComposeBySourceUrlPopupAtom);

  const onClickNavTab = () => {
    setIsPostDetailInfoPopup(false);
  };

  useEffect(() => {
    return () => {
      setIsActivePostComposePopup(false);
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
              <MessageTabActiveIcon />
            ) : (
              <MessageTabNotActiveIcon />
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
              <ProfileTabActiveIcon />
            ) : (
              <ProfileTabNotActiveIcon />
            )}
            <TabText>프로필</TabText>
          </NavLink>
        </StyleTab>
      </BottomNavBarContainer>
      {isActivePostComposePopup && <PostComposePopup />}
      {isActivePostComposeBySourceUrlPopup && <PostComposeBySourceUrlPopup />}
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
  padding: 10px 0 3vh 0;
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

export default BottomNavBar;
