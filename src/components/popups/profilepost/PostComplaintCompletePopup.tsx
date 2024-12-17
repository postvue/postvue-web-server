import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import BlockUserPopupBody from 'components/profile/blockuser/BlockUserPopupBody';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
import { useRecoilState } from 'recoil';
import { isActivePostComplaintCompletePopupAtom } from 'states/PostAtom';
import styled from 'styled-components';

interface PostComplaintPopupProps {
  userInfo: { username: string; userId: string };
  isBlocked: boolean;
  hasTransparentOverLay?: boolean;
  setIsBlocked?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettingPopup?: React.Dispatch<React.SetStateAction<boolean>>;
  isFixed?: boolean;
}
const PostComplaintCompletePopup: React.FC<PostComplaintPopupProps> = ({
  userInfo,
  isBlocked,
  setIsBlocked,
  isFixed,
}) => {
  const [
    isActivePostComplaintCompletePopup,
    setIsActivePostComplaintCompletePopup,
  ] = useRecoilState(isActivePostComplaintCompletePopupAtom);

  const { windowWidth } = useWindowSize();

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
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <BottomSheetLayout
          isFixed={isFixed}
          isOpen={isActivePostComplaintCompletePopup}
          onClose={() => setIsActivePostComplaintCompletePopup(false)}
          heightNum={500}
        >
          <PostReportBody />
        </BottomSheetLayout>
      ) : (
        <>
          {isActivePostComplaintCompletePopup && (
            <RoundSquareCenterPopupLayout
              onClose={() => setIsActivePostComplaintCompletePopup(false)}
              popupWrapStyle={{ height: '400px', width: '500px' }}
            >
              <PostReportBody />
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
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
