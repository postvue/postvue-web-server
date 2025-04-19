import React, { ReactNode, Suspense, useEffect, useRef } from 'react';
import styled from 'styled-components';

import BlockUserPopup from 'components/popups/BlockUserPopup';
import MakeScrapPopup from 'components/popups/makescrap/MakeScrapPopup';
import MapExploreByScrapPopup from 'components/popups/mapexplore/MapExploreByScrapPopup';
import PostComposePopup from 'components/popups/postcompose/PostComposePopup';
import PostComposeSelectPopup from 'components/popups/postcompose/PostComposeSelectPopup';
import PostComposeBySourceUrlPopup from 'components/popups/postcompose/postcomposesourceurlpopup/PostComposeBySourceUrlPopup';
import PostComposeVideoPopup from 'components/popups/postcompose/PostComposeVideoPopup';
import PostEditPopup from 'components/popups/postedit/PostEditPopup';
import PostReactionCommentSettingPopup from 'components/popups/postreactionpopup/PostReactionCommentSettingPopup';
import ProfileAccountComplaintPopup from 'components/popups/profileaccount/ProfileAccountComplaintPopup';
import ProfileOtherAccountPopup from 'components/popups/profileaccount/ProfileOtherAccountPopup';
import ProfileDetailPopup from 'components/popups/ProfileDetailPopup';
import ComplaintCompletePopup from 'components/popups/profilepost/ComplaintCompletePopup';
import PostMapGuideSelectPopup from 'components/popups/profilepost/postselectmapcontentpopup/PostMapGuideSelectPopup';
import PostSelectMapContentPopup from 'components/popups/profilepost/postselectmapcontentpopup/PostSelectMapContentPopup';
import PostSettingPopup from 'components/popups/profilepost/PostSettingPopup';
import ProfilePostDetailPopup from 'components/popups/ProfilePostDetailPopup';
import ScrapViewPopup from 'components/popups/profilescrap/ScrapViewPopup';
import ProfileScrapTargetAudiencePopup from 'components/popups/ProfileScrapTargetAudiencePopup';
import SearchFavoriteTermEditPopup from 'components/popups/search/SearchFavoriteTermEditPopup';
import ServiceUsageTimerPopup from 'components/popups/service/usagetimer/ServiceUsageTimerPopup';
import ToastPopup from 'components/popups/ToastMsgPopup';
import {
  MEDIA_MIDDLE_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import { sendInitEvent } from 'global/util/reactnative/nativeRouter';
import { isValidString } from 'global/util/ValidUtil';
import useObjectScrollY from 'hook/customhook/useWindowScrollY';
import useWindowSize from 'hook/customhook/useWindowSize';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  activeMakeScrapPopupInfoAtom,
  activePostComplaintCompletePopupAtom,
  activePostDotSettingInfoAtom,
  activePostMapGuideSelectPopupInfoAtom,
  activePostSelectMapContentPopupInfoAtom,
  commentSettingPopupInfoAtom,
  isPostDetailInfoPopupAtom,
  postDetailInfoPopupAtom,
} from 'states/PostAtom';
import {
  isActivPostComposeBySourceUrlPopupAtom,
  isActivPostComposePopupAtom,
  isActivPostComposeSelectPopupAtom,
  isActivPostVideoComposePopupAtom,
  isNotSupportVideoConfirmPopupAtom,
  postEditActiveInfoPopupAtom,
} from 'states/PostComposeAtom';
import {
  activeMapScrapPopupAtom,
  activeProfileAccountComplaintPopupAtom,
  activeProfileAccountPopupInfoAtom,
  activeProfileBlockPopupInfoAtom,
  activeScrapViewPopupInfoAtom,
  isActiveProfileScarpTargetAudPopupAtom,
  profileDetailInfoPopupAtom,
} from 'states/ProfileAtom';
import { isActiveSearchFavoritePopupAtom } from 'states/SearchPostAtom';
import { sharePopupInfoAtom } from 'states/ShareAtom';
import { serviceUsageTimerStateAtom } from 'states/SystemConfigAtom';
import theme from 'styles/theme';

const AppBaseTemplateSideBar = React.lazy(
  () => import('./AppBaseTemplateSideBar'),
);
const SideNavBar = React.lazy(() => import('components/SideNavBar'));

const ConfirmCheckPopup = React.lazy(
  () => import('components/popups/ConfirmCheckPopup'),
);

interface AppBaseTemplate {
  children: ReactNode;
  slideBarNode?: ReactNode;
  SlideBarNodeStyle?: React.CSSProperties;
  hasSearchInputModule?: boolean;
  hasSearchBodyModule?: boolean;
  hasPostSearchFilterPopupBody?: boolean;
  SideContainerStyle?: React.CSSProperties;
  SideBarNodeWrapStyle?: React.CSSProperties;
  SideSearchBodyWrapStyle?: React.CSSProperties;
  AppContainerStyle?: React.CSSProperties;
  isTransparentSearchButton?: boolean;
  isAppInsetTopMargin?: boolean;
  isDisplayFavoriteTerm?: boolean;
  isAppContainerTopMargin?: boolean;
  appContainerTopMargin?: string;
  appRef?: React.RefObject<HTMLDivElement>;
  sideWidth?: number;
  headerWidth?: number;
  appContainerWidth?: number;
  isScrollByAppContainer?: boolean;
  isScrollSave?: boolean;
  fixedScrollPos?: number;
  AppBaseStlye?: React.CSSProperties;
  AppHeaderNode?: React.ReactNode;
  AppBottomNode?: React.ReactNode;
  appContainerRefObject?: React.RefObject<HTMLDivElement>;
}

const AppBaseTemplate: React.FC<AppBaseTemplate> = ({
  children,
  slideBarNode,
  hasSearchInputModule = true,
  hasSearchBodyModule = true,
  hasPostSearchFilterPopupBody = false,
  SideContainerStyle,
  SlideBarNodeStyle,
  SideBarNodeWrapStyle,
  SideSearchBodyWrapStyle,
  AppContainerStyle,
  isTransparentSearchButton = false,
  isDisplayFavoriteTerm = true,
  isAppContainerTopMargin = true,
  appContainerTopMargin = theme.systemSize.header.height,
  isAppInsetTopMargin = true,
  appRef,
  sideWidth = 400,
  headerWidth = 400,
  appContainerWidth = theme.systemSize.appDisplaySize.widthByPcNum,
  isScrollByAppContainer = true,
  isScrollSave = true,
  fixedScrollPos,
  AppBaseStlye,
  AppHeaderNode,
  AppBottomNode,
  appContainerRefObject,
}) => {
  const { windowWidth } = useWindowSize();

  const isActivePostComposeBySourceUrlPopup = useRecoilValue(
    isActivPostComposeBySourceUrlPopupAtom,
  );
  const isActivePostComposePopup = useRecoilValue(isActivPostComposePopupAtom);
  const isActivePostVideoComposePopup = useRecoilValue(
    isActivPostVideoComposePopupAtom,
  );
  const postEditActiveInfoPopup = useRecoilValue(postEditActiveInfoPopupAtom);
  const sharePopupInfo = useRecoilValue(sharePopupInfoAtom);
  const isActivePostComposeSelectPopup = useRecoilValue(
    isActivPostComposeSelectPopupAtom,
  );
  const [isNotSupportVideoConfirmPopup, setIsNotSupportVideoConfirmPopup] =
    useRecoilState(isNotSupportVideoConfirmPopupAtom);

  const postDetailInfoPopup = useRecoilValue(postDetailInfoPopupAtom);

  const isPostDetailInfoPopup = useRecoilValue(isPostDetailInfoPopupAtom);

  const profileDetailInfoPopup = useRecoilValue(profileDetailInfoPopupAtom);

  const isActiveSearchFavoritePopup = useRecoilValue(
    isActiveSearchFavoritePopupAtom,
  );

  const activePostDotSettingInfo = useRecoilValue(activePostDotSettingInfoAtom);

  const activeScrapViewPopupInfo = useRecoilValue(activeScrapViewPopupInfoAtom);

  const activeMapScrapPopup = useRecoilValue(activeMapScrapPopupAtom);

  const serviceUsageTimerState = useRecoilValue(serviceUsageTimerStateAtom);
  const activeProfileAccountComplaintPopup = useRecoilValue(
    activeProfileAccountComplaintPopupAtom,
  );

  const isActiveProfileScarpTargetAudPopup = useRecoilValue(
    isActiveProfileScarpTargetAudPopupAtom,
  );
  const commentSettingPopupInfo = useRecoilValue(commentSettingPopupInfoAtom);

  const activeProfileBlockInfo = useRecoilValue(
    activeProfileBlockPopupInfoAtom,
  );

  const activeMakeScrapPopupInfo = useRecoilValue(activeMakeScrapPopupInfoAtom);

  const activeProfileAccountPopupInfo = useRecoilValue(
    activeProfileAccountPopupInfoAtom,
  );

  const activePostSelectMapContentPopupInfo = useRecoilValue(
    activePostSelectMapContentPopupInfoAtom,
  );

  const activePostMapGuideSelectPopupInfo = useRecoilValue(
    activePostMapGuideSelectPopupInfoAtom,
  );

  const [
    activePostComplaintCompletePopup,
    setActivePostComplaintCompletePopup,
  ] = useRecoilState(activePostComplaintCompletePopupAtom);

  const appContainerRef = appContainerRefObject
    ? appContainerRefObject
    : useRef<HTMLDivElement>(null);

  // @REFER: 수정이 필요한 코드
  // ================
  if (isScrollSave) {
    const { scrollInfos, scrollRemove } = useObjectScrollY({
      path: location.pathname,
      refObject: appContainerRef,
    });

    useEffect(() => {
      setTimeout(() => {
        if (windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM) {
          if (appContainerRef.current) {
            appContainerRef.current.scrollTo({ top: scrollInfos });
          }

          scrollRemove();
        } else {
          window.scrollTo({ top: scrollInfos });
        }
      }, 30);
    }, [location.pathname]);
  }

  if (fixedScrollPos != undefined) {
    useEffect(() => {
      setTimeout(() => {
        if (windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM) {
          if (appContainerRef.current) {
            appContainerRef.current.scrollTo({ top: fixedScrollPos });
          }
        } else {
          window.scrollTo({ top: fixedScrollPos });
        }
      }, 30);
    }, [location.pathname]);
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        sendInitEvent();
      }, 100);
    });
  }, []);

  return (
    <>
      <Container id="app" ref={appRef}>
        {/* refer: 수정 */}
        {windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM && (
          <Suspense fallback={<></>}>
            <SideNavBar headerWidth={headerWidth} />
          </Suspense>
        )}

        <Main id="main" $isAppInsetTopMargin={isAppInsetTopMargin}>
          <MainContainer>
            <MainWrap>
              <AppBase style={AppBaseStlye}>
                {AppHeaderNode}
                <AppContainer
                  style={AppContainerStyle}
                  $isAppContainerTopMargin={isAppContainerTopMargin}
                  $appContainerTopMargin={appContainerTopMargin}
                  $appContainerSize={appContainerWidth}
                  $isScrollByAppContainer={isScrollByAppContainer}
                  ref={appContainerRef}
                >
                  {children}
                </AppContainer>
                {AppBottomNode}
              </AppBase>

              {windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM && (
                <Suspense fallback={<></>}>
                  <AppBaseTemplateSideBar
                    slideBarNode={slideBarNode}
                    SlideBarNodeStyle={SlideBarNodeStyle}
                    hasSearchInputModule={hasSearchInputModule}
                    hasSearchBodyModule={hasSearchBodyModule}
                    hasPostSearchFilterPopupBody={hasPostSearchFilterPopupBody}
                    SideContainerStyle={SideContainerStyle}
                    SideBarNodeWrapStyle={SideBarNodeWrapStyle}
                    SideSearchBodyWrapStyle={SideSearchBodyWrapStyle}
                    isTransparentSearchButton={isTransparentSearchButton}
                    isDisplayFavoriteTerm={isDisplayFavoriteTerm}
                    isScrollByAppContainer={isScrollByAppContainer}
                    sideWidth={sideWidth}
                  />
                </Suspense>
              )}
            </MainWrap>
          </MainContainer>
        </Main>

        {profileDetailInfoPopup.isActive && <ProfileDetailPopup />}
        {isPostDetailInfoPopup && isValidString(postDetailInfoPopup.postId) && (
          <ProfilePostDetailPopup />
        )}

        {/* {sharePopupInfo.isActive && <SnsSharePopup />} */}
        {isActivePostComposeSelectPopup && <PostComposeSelectPopup />}
        {isNotSupportVideoConfirmPopup && (
          <ConfirmCheckPopup
            onClose={() => {
              setIsNotSupportVideoConfirmPopup(false);
            }}
            popupOverLayContainerStyle={{ zIndex: 2000 }}
            confirmPopupTitle={'앱을 이용해주세요.'}
            confirmPopupSubTitle={
              '비디오 업로드 기능은 PC 또는 앱에서만 이용할 수 있습니다.'
            }
          />
        )}
        {isActivePostComposeBySourceUrlPopup && <PostComposeBySourceUrlPopup />}
        {isActivePostComposePopup &&
          windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM && <PostComposePopup />}
        {isActivePostVideoComposePopup &&
          windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM && (
            <PostComposeVideoPopup />
          )}
        {postEditActiveInfoPopup.isActive &&
          windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM && (
            <>
              <PostEditPopup postId={postEditActiveInfoPopup.postId} />
            </>
          )}
        {isActiveSearchFavoritePopup && <SearchFavoriteTermEditPopup />}
        {activePostDotSettingInfo.isActive && <PostSettingPopup />}

        {activeScrapViewPopupInfo.isActive &&
          activeScrapViewPopupInfo.snsPost && (
            <ScrapViewPopup snsPost={activeScrapViewPopupInfo.snsPost} />
          )}
        {activeMapScrapPopup.isActive && (
          <>
            <MapExploreByScrapPopup />
          </>
        )}
        {serviceUsageTimerState && <ServiceUsageTimerPopup />}
        {activeProfileAccountComplaintPopup.isActive && (
          <ProfileAccountComplaintPopup />
        )}
        {activePostComplaintCompletePopup.isActive && (
          <ComplaintCompletePopup
            userInfo={{
              userId: activePostComplaintCompletePopup.userId,
              username: activePostComplaintCompletePopup.username,
            }}
          />
        )}
        {activeProfileBlockInfo.isActive && <BlockUserPopup />}
        {activeMakeScrapPopupInfo.isActive && <MakeScrapPopup />}
        {isActiveProfileScarpTargetAudPopup && (
          <ProfileScrapTargetAudiencePopup />
        )}
        {commentSettingPopupInfo.isActive && (
          <PostReactionCommentSettingPopup />
        )}
        {activePostSelectMapContentPopupInfo.isActive && (
          <PostSelectMapContentPopup />
        )}
        {activePostMapGuideSelectPopupInfo.isActive && (
          <PostMapGuideSelectPopup />
        )}
        {activeProfileAccountPopupInfo.isActive && <ProfileOtherAccountPopup />}
      </Container>
      <ToastPopup />
    </>
  );
};

const CONTAINER_GAP = 70;
const CONTAINER_MIN_GAP = 30;

const Container = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: row;

  // @media (max-width: ${MEDIA_MIDDLE_WIDTH}) {
  //   gap: ${CONTAINER_MIN_GAP}px;
  // }

  @media (min-width: ${MEDIA_MIDDLE_WIDTH}) {
    gap: ${CONTAINER_GAP}px;
  }
`;

const Main = styled.main<{ $isAppInsetTopMargin: boolean }>`
  padding-top: ${(props) =>
    props.$isAppInsetTopMargin ? `env(safe-area-inset-top)` : '0px'};
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    width: 100%;
  }
`;

const MainContainer = styled.div``;

const MainWrap = styled.div`
  display: flex;

  @media ((min-width: ${MEDIA_MOBILE_MAX_WIDTH}) and (max-width: ${MEDIA_MIDDLE_WIDTH})) {
    gap: ${CONTAINER_MIN_GAP}px;
  }

  @media (min-width: ${MEDIA_MIDDLE_WIDTH}) {
    gap: ${CONTAINER_GAP}px;
  }

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
    margin: auto;
  }
`;

const AppBase = styled.div`
  width: 100%;
`;

const AppContainer = styled.div<{
  $isAppContainerTopMargin: boolean;
  $appContainerTopMargin: string;
  $appContainerSize: number;
  $isScrollByAppContainer: boolean;
}>`
  width: 100%;
  position: relative;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${(props) => props.$appContainerSize}px;
    min-width: ${(props) => props.$appContainerSize}px;

    overscroll-behavior: none;
    height: ${(props) => (props.$isScrollByAppContainer ? '100dvh' : 'auto')};
    overflow: ${(props) => (props.$isScrollByAppContainer ? 'scroll' : '')};
  }

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
    margin: auto;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 20px 0px;
    min-height: calc(
      100dvh -
        ${(props) =>
          props.$isAppContainerTopMargin ? props.$appContainerTopMargin : '0px'}
    );
    padding-top: ${(props) =>
      props.$isAppContainerTopMargin ? props.$appContainerTopMargin : '0px'};
  }

  @media (max-width: ${theme.systemSize.appDisplaySize.maxWidth}) {
    box-shadow: none;
  }
`;

export default AppBaseTemplate;
