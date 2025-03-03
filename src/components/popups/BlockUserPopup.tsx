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
import { isActiveProfileBlockPopupAtom } from '../../states/ProfileAtom';
import ConfirmCheckPopup from './ConfirmCheckPopup';

interface BlockUserPopupProps {
  userInfo: { username: string; userId: string };
}
const BlockUserPopup: React.FC<BlockUserPopupProps> = ({ userInfo }) => {
  const [isActiveProfileBlock, setIsActiveProfileBlock] = useRecoilState(
    isActiveProfileBlockPopupAtom,
  );

  const { windowWidth } = useWindowSize();

  const { data: profileInfo, isFetched: isFetchedByProfileInfo } =
    QueryStateProfileInfo(userInfo.username);

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  const { refetch: refetchByBlockUserList } =
    QueryStateProfileBlockedUserList();

  const { refetch: refetchByProfileAccountPostList } =
    QueryStateProfileAccountPostList(userInfo.username);

  const { refetch: refetchByProfileInfo } = QueryStateProfileInfo(
    userInfo.username,
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
                  isOpen={isActiveProfileBlock}
                  onClose={() => setIsActiveProfileBlock(false)}
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
                    userInfo={userInfo}
                    onOpenCheck={() => setIsActiveBlockComplete(true)}
                  />
                </BottomSheetLayout>
              </>
            ) : (
              <>
                {isActiveProfileBlock && (
                  <RoundSquareCenterPopupLayout
                    onClose={() => setIsActiveProfileBlock(false)}
                    popupWrapStyle={
                      profileInfo.isBlocked
                        ? { height: '280px', width: '400px' }
                        : { height: '350px', width: '450px' }
                    }
                    popupOverLayContainerStyle={{ zIndex: '2000' }}
                  >
                    <BlockUserPopupBody
                      profileInfo={profileInfo}
                      userInfo={userInfo}
                      onOpenCheck={() => {
                        setIsActiveBlockComplete(true);
                      }}
                    />
                  </RoundSquareCenterPopupLayout>
                )}
              </>
            )}
            {isActiveProfileBlock && <MyAccountSettingInfoState />}
            {isActiveBlockComplete && (
              <ConfirmCheckPopup
                confirmPopupTitle={
                  !profileInfo.isBlocked
                    ? '차단되었습니다.'
                    : '차단 해재되었습니다.'
                }
                confirmPopupSubTitle={
                  !profileInfo.isBlocked
                    ? `${userInfo.username}님은 회원님의 게시물에 메시지, 댓글 등과 같은 반응은 할 수 없습니다.`
                    : `${userInfo.username}님은 나를 팔로우하여 내 게시물을 볼 수 있습니다.`
                }
                onClose={() => {
                  setIsActiveBlockComplete(false);
                  refetchByBlockUserList();
                  refetchByProfileAccountPostList();
                  refetchByProfileInfo();
                  if (windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM) {
                    setIsExternalCloseFunc(true);
                  } else {
                    setIsActiveProfileBlock(false);
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
