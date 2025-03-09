import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import BlockUserPopupBody from 'components/profile/blockuser/BlockUserPopupBody';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateProfileAccountPostList } from 'hook/queryhook/QueryStateProfileAccountPostList';
import { QueryStateProfileBlockedUserList } from 'hook/queryhook/QueryStateProfileBlockedUserList';
import { QueryStateProfileInfo } from 'hook/queryhook/QueryStateProfileInfo';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { activeProfileBlockPopupInfoAtom } from 'states/ProfileAtom';
import ConfirmCheckPopup from './ConfirmCheckPopup';

const BlockUserPopup: React.FC = () => {
  const [activeProfileBlockPopupInfo, setActiveProfileBlockPopupInfo] =
    useRecoilState(activeProfileBlockPopupInfoAtom);

  const { windowWidth } = useWindowSize();

  const { data: profileInfo, isFetched: isFetchedByProfileInfo } =
    QueryStateProfileInfo(activeProfileBlockPopupInfo.username);

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  const { refetch: refetchByBlockUserList } =
    QueryStateProfileBlockedUserList();

  const { refetch: refetchByProfileAccountPostList } =
    QueryStateProfileAccountPostList(activeProfileBlockPopupInfo.username);

  const { refetch: refetchByProfileInfo } = QueryStateProfileInfo(
    activeProfileBlockPopupInfo.username,
  );

  const [isActiveBlockComplete, setIsActiveBlockComplete] =
    useState<boolean>(false);
  return (
    <>
      <>
        {profileInfo && isFetchedByProfileInfo && (
          <>
            {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
              <>
                <BottomSheetLayout
                  isOpen={activeProfileBlockPopupInfo.isActive}
                  onClose={() =>
                    setActiveProfileBlockPopupInfo({
                      isActive: false,
                      userId: '',
                      username: '',
                    })
                  }
                  isExternalCloseFunc={isExternalCloseFunc}
                  heightNum={
                    (profileInfo.isBlocked ? 250 : 320) +
                      parseFloat(
                        getComputedStyle(
                          document.documentElement,
                        ).getPropertyValue('--safe-area-inset-bottom'),
                      ) || 0
                  }
                >
                  <BlockUserPopupBody
                    profileInfo={profileInfo}
                    userInfo={{
                      userId: activeProfileBlockPopupInfo.userId,
                      username: activeProfileBlockPopupInfo.username,
                    }}
                    onOpenCheck={() => setIsActiveBlockComplete(true)}
                  />
                </BottomSheetLayout>
              </>
            ) : (
              <>
                {activeProfileBlockPopupInfo.isActive && (
                  <RoundSquareCenterPopupLayout
                    onClose={() =>
                      setActiveProfileBlockPopupInfo({
                        isActive: false,
                        userId: '',
                        username: '',
                      })
                    }
                    popupWrapStyle={
                      profileInfo.isBlocked
                        ? { height: '280px', width: '400px' }
                        : { height: '350px', width: '450px' }
                    }
                    popupOverLayContainerStyle={{ zIndex: '2000' }}
                  >
                    <BlockUserPopupBody
                      profileInfo={profileInfo}
                      userInfo={{
                        userId: activeProfileBlockPopupInfo.userId,
                        username: activeProfileBlockPopupInfo.username,
                      }}
                      onOpenCheck={() => {
                        setIsActiveBlockComplete(true);
                      }}
                    />
                  </RoundSquareCenterPopupLayout>
                )}
              </>
            )}
            {activeProfileBlockPopupInfo.isActive && (
              <MyAccountSettingInfoState />
            )}
            {isActiveBlockComplete && (
              <ConfirmCheckPopup
                confirmPopupTitle={
                  !profileInfo.isBlocked
                    ? '차단되었습니다.'
                    : '차단 해재되었습니다.'
                }
                confirmPopupSubTitle={
                  !profileInfo.isBlocked
                    ? `${activeProfileBlockPopupInfo.username}님은 회원님의 게시물에 메시지, 댓글 등과 같은 반응은 할 수 없습니다.`
                    : `${activeProfileBlockPopupInfo.username}님은 나를 팔로우하여 내 게시물을 볼 수 있습니다.`
                }
                onClose={() => {
                  setIsActiveBlockComplete(false);
                  refetchByBlockUserList();
                  refetchByProfileAccountPostList();
                  refetchByProfileInfo();
                  if (windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM) {
                    setIsExternalCloseFunc(true);
                  } else {
                    setActiveProfileBlockPopupInfo({
                      isActive: false,
                      userId: '',
                      username: '',
                    });
                  }
                }}
              />
            )}
          </>
        )}
      </>
    </>
  );
};

export default BlockUserPopup;
