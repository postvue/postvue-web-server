import { ReactComponent as PostScrapButtonWhiteIcon } from 'assets/images/icon/svg/post/PostClipButton20x20WhiteIcon.svg';
import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import BottomSheetLayout from 'components/layouts/BottomSheetLayout';

import ProfileMakeScrapBody from 'components/profile/ProfileMakeScrapBody';
import ProfileMakeScrapHeader from 'components/profile/ProfileMakeScrapHeader';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { CREATE_SCRAP } from 'const/SystemPhraseConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import React, { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { activeMakeScrapPopupInfoAtom } from 'states/PostAtom';
import theme from 'styles/theme';
import { notify } from '../ToastMsgPopup';

const RoundSquareCenterPopupLayout = React.lazy(
  () => import('components/layouts/RoundSquareCenterPopupLayout'),
);

const MakeScrapPopup: React.FC = () => {
  const [activeMakeScrapPopupInfo, setActiveMakeScrapPopupInfo] =
    useRecoilState(activeMakeScrapPopupInfoAtom);

  const { windowWidth } = useWindowSize();

  const { data: profileInfo, isFetched: isFetchedByProfileInfo } =
    QueryStateMyProfileInfo();

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  const navigate = useNavigate();
  return (
    <>
      <>
        {profileInfo && isFetchedByProfileInfo && (
          <>
            {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
              <>
                <BottomSheetLayout
                  isOpen={activeMakeScrapPopupInfo.isActive}
                  onClose={() =>
                    setActiveMakeScrapPopupInfo({
                      isActive: false,

                      postId: '',
                      postContentType: '',
                      postContentUrl: '',
                    })
                  }
                  isExternalCloseFunc={isExternalCloseFunc}
                  heightNum={window.innerHeight - 100}
                >
                  <ProfileMakeScrapHeader
                    HeaderLayoutStyle={{
                      position: 'static',
                      paddingTop: '0px',
                    }}
                    isActionFunc={true}
                    actionFunc={() => setIsExternalCloseFunc(true)}
                  />

                  <ProfileMakeScrapBody
                    postId={activeMakeScrapPopupInfo.postId}
                    postContentType={activeMakeScrapPopupInfo.postContentType}
                    postContentUrl={activeMakeScrapPopupInfo.postContentUrl}
                    actionByApp={() => {
                      setIsExternalCloseFunc(true);
                      notify({
                        msgIcon: <PostScrapButtonWhiteIcon />,
                        msgTitle: CREATE_SCRAP,
                      });
                    }}
                    actionByWeb={() => {
                      setIsExternalCloseFunc(true);

                      notify({
                        msgIcon: <PostScrapButtonWhiteIcon />,
                        msgTitle: CREATE_SCRAP,
                      });
                    }}
                    ProfileMakeScrapBodyContainerStyle={{
                      height: `calc(100% - ${theme.systemSize.header.heightNumber + 15}px)`,
                    }}
                    BottomNextButtonWrapContainerStyle={{
                      position: 'absolute',
                      bottom: 0,
                    }}
                    isInsetTop={false}
                  />
                </BottomSheetLayout>
              </>
            ) : (
              <>
                {activeMakeScrapPopupInfo.isActive && (
                  <Suspense>
                    <RoundSquareCenterPopupLayout
                      onClose={() =>
                        setActiveMakeScrapPopupInfo({
                          isActive: false,

                          postId: '',
                          postContentType: '',
                          postContentUrl: '',
                        })
                      }
                      popupWrapStyle={{ height: '95%' }}
                      popupOverLayContainerStyle={{ zIndex: '2000' }}
                    >
                      <ProfileMakeScrapHeader
                        HeaderLayoutStyle={{
                          position: 'static',
                          paddingTop: '0px',
                        }}
                        isActionFunc={true}
                        actionFunc={() =>
                          setActiveMakeScrapPopupInfo({
                            isActive: false,

                            postId: '',
                            postContentType: '',
                            postContentUrl: '',
                          })
                        }
                      />
                      <ProfileMakeScrapBody
                        postId={activeMakeScrapPopupInfo.postId}
                        postContentType={
                          activeMakeScrapPopupInfo.postContentType
                        }
                        postContentUrl={activeMakeScrapPopupInfo.postContentUrl}
                        actionByApp={() => ''}
                        actionByWeb={() => {
                          setActiveMakeScrapPopupInfo({
                            isActive: false,

                            postId: '',
                            postContentType: '',
                            postContentUrl: '',
                          });

                          notify({
                            msgIcon: <PostScrapButtonWhiteIcon />,
                            msgTitle: CREATE_SCRAP,
                          });
                        }}
                      />
                    </RoundSquareCenterPopupLayout>
                  </Suspense>
                )}
              </>
            )}
            {activeMakeScrapPopupInfo.isActive && <MyAccountSettingInfoState />}
          </>
        )}
      </>
    </>
  );
};

export default MakeScrapPopup;
