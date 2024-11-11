import WindowResizeSenceComponent from 'components/common/container/WindowResizeSenseComponent';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import BlockUserPopupBody from 'components/profile/blockuser/BlockUserPopupBody';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { isActivePostComplaintCompletePopupAtom } from 'states/PostAtom';
import styled from 'styled-components';
import PopupLayout from '../../layouts/PopupLayout';

const popupWrapStyle: React.CSSProperties = {
  height: '60%',
};

interface PostComplaintPopupProps {
  userInfo: { username: string; userId: string };
  isBlocked: boolean;
  hasTransparentOverLay?: boolean;
  setIsBlocked?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettingPopup?: React.Dispatch<React.SetStateAction<boolean>>;
}
const PostComplaintCompletePopup: React.FC<PostComplaintPopupProps> = ({
  userInfo,
  isBlocked,
  hasTransparentOverLay = false,
  setIsBlocked,
}) => {
  const setIsActivePostComplaintCompletePopup = useSetRecoilState(
    isActivePostComplaintCompletePopupAtom,
  );

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const PostReportBody = () => {
    return (
      <>
        <Container>
          <Title>알려주셔서 감사합니다.</Title>
          <Message>최대한 빠른 시일에 처리하겠습니다.</Message>
        </Container>
        {!isBlocked && (
          <BlockUserPopupBody
            userInfo={userInfo}
            isBlocked={isBlocked}
            setIsBlocked={setIsBlocked}
          />
        )}
      </>
    );
  };

  return (
    <>
      {windowSize.width <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <PopupLayout
          setIsPopup={setIsActivePostComplaintCompletePopup}
          isTouchScrollBar={true}
          popupWrapStyle={popupWrapStyle}
          hasTransparentOverLay={hasTransparentOverLay}
          hasFixedActive={true}
        >
          <PostReportBody />
        </PopupLayout>
      ) : (
        <RoundSquareCenterPopupLayout
          setIsPopup={setIsActivePostComplaintCompletePopup}
          popupWrapStyle={{ height: '400px', width: '500px' }}
        >
          <PostReportBody />
        </RoundSquareCenterPopupLayout>
      )}

      <WindowResizeSenceComponent setWindowSize={setWindowSize} />
    </>
  );
};

export default PostComplaintCompletePopup;

const Container = styled.div`
  text-align: center;
  margin-top: 36px;
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
`;
