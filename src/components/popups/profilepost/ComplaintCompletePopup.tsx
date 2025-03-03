import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import BlockUserPopupBody from 'components/profile/blockuser/BlockUserPopupBody';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateProfileAccountPostList } from 'hook/queryhook/QueryStateProfileAccountPostList';
import { QueryStateProfileBlockedUserList } from 'hook/queryhook/QueryStateProfileBlockedUserList';
import { QueryStateProfileInfo } from 'hook/queryhook/QueryStateProfileInfo';
import React, { useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { activePostComplaintCompletePopupAtom } from 'states/PostAtom';
import styled from 'styled-components';
import ConfirmCheckPopup from '../ConfirmCheckPopup';

interface PostComplaintPopupProps {
  userInfo: { username: string; userId: string };
}
const ComplaintCompletePopup: React.FC<PostComplaintPopupProps> = ({
  userInfo,
}) => {
  const activePostComplaintCompletePopup = useRecoilValue(
    activePostComplaintCompletePopupAtom,
  );
  const resetActivePostComplaintCompletePopup = useResetRecoilState(
    activePostComplaintCompletePopupAtom,
  );

  const { windowWidth } = useWindowSize();

  const {
    data: profileInfo,
    isFetched: isFetchedByProfileInfo,
    refetch: refetchByProfileInfo,
  } = QueryStateProfileInfo(userInfo.username);

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  const [isActiveBlockComplete, setIsActiveBlockComplete] =
    useState<boolean>(false);

  const { refetch: refetchByBlockUserList } =
    QueryStateProfileBlockedUserList();

  const { refetch: refetchByProfileAccountPostList } =
    QueryStateProfileAccountPostList(userInfo.username);

  const PostReportBody = () => {
    return (
      <>
        <Container>
          <Title>알려주셔서 감사합니다.</Title>
          <Message>최대한 빠른 시일에 처리하겠습니다.</Message>
        </Container>
        {isFetchedByProfileInfo && profileInfo && !profileInfo.isBlocked && (
          <BlockUserPopupBody
            userInfo={userInfo}
            profileInfo={profileInfo}
            onOpenCheck={() => setIsActiveBlockComplete(true)}
          />
        )}
      </>
    );
  };

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <BottomSheetLayout
          isOpen={activePostComplaintCompletePopup.isActive}
          onClose={() => resetActivePostComplaintCompletePopup()}
          isExternalCloseFunc={isExternalCloseFunc}
          heightNum={
            420 +
              parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue(
                  '--safe-area-inset-bottom',
                ),
              ) || 0
          }
        >
          <PostReportBody />
        </BottomSheetLayout>
      ) : (
        <>
          {activePostComplaintCompletePopup.isActive && (
            <RoundSquareCenterPopupLayout
              onClose={() => resetActivePostComplaintCompletePopup()}
              popupWrapStyle={{ height: '420px', width: '500px' }}
            >
              <PostReportBody />
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
      {profileInfo && isActiveBlockComplete && (
        <ConfirmCheckPopup
          confirmPopupTitle={
            !profileInfo.isBlocked ? '차단되었습니다.' : '차단 해재되었습니다.'
          }
          confirmPopupSubTitle={
            !profileInfo.isBlocked
              ? `${userInfo.username}님은 회원님의 게시물에 메시지, 댓글 등과 같은 반응은 할 수 없습니다.`
              : `${userInfo.username}님은 나를 팔로우하여 내 게시물을 볼 수 있습니다.`
          }
          onClose={() => {
            resetActivePostComplaintCompletePopup();
            setIsActiveBlockComplete(false);
            refetchByBlockUserList();
            refetchByProfileAccountPostList();
            refetchByProfileInfo();
            setIsExternalCloseFunc(true);
          }}
        />
      )}
    </>
  );
};

export default ComplaintCompletePopup;

const Container = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.div`
  font-size: 22px;
  line-height: 1.4;
  font-family: 'Pretendard-Bold';
  letter-spacing: -0.6px;
  font-style: normal;
`;

const Message = styled.div`
  font-size: 14px;
  line-height: 1.7;
  font-family: 'Pretendard-Medium';
  letter-spacing: -0.35px;
  font-style: normal;
  padding-bottom: 10px;
`;
