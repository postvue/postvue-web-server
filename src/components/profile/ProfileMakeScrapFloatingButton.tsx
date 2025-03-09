import { ReactComponent as MakeScrapButtonIcon } from 'assets/images/icon/svg/scrap/MakeScrapButtonIcon.svg';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { activeMakeScrapPopupInfoAtom } from 'states/PostAtom';
import styled from 'styled-components';
import FloatingActionButtonLayout from '../layouts/FloatingActionButtonLayout';

interface FloatingActionButtonLayoutButtonProps {
  isShow: boolean;
  FloatingActionButtonLayoutStyle?: React.CSSProperties;
}

const ProfileMakeScrapFloatingButton: React.FC<
  FloatingActionButtonLayoutButtonProps
> = ({ isShow, FloatingActionButtonLayoutStyle }) => {
  const navigate = useNavigate();

  const setActiveMakeScrapPopupInfo = useSetRecoilState(
    activeMakeScrapPopupInfoAtom,
  );

  const { windowWidth } = useWindowSize();

  return (
    <>
      {isShow && (
        <FloatingActionButtonLayout
          FloatingActionButtonLayoutStyle={FloatingActionButtonLayoutStyle}
          bottomGap={56}
          actionFunc={() => {
            setActiveMakeScrapPopupInfo({
              isActive: true,
              postId: '',
              postContentType: '',
              postContentUrl: '',
            });
            // if (!isApp()) {
            //   setActiveMakeScrapPopupInfo({
            //     isActive: true,
            //     postId: '',
            //     postContentType: '',
            //     postContentUrl: '',
            //   });
            // } else {
            //   stackRouterPush(navigate, PROFILE_NEW_SCRAP_PATH);
            // }
          }}
        >
          <div>
            <MakeScrapButton>
              <MakeScrapButtonIconWrap>
                <MakeScrapButtonWrap>
                  <MakeScrapButtonIcon />
                </MakeScrapButtonWrap>
              </MakeScrapButtonIconWrap>
              <MakeScrapButtonTitle>스크랩 추가하기</MakeScrapButtonTitle>
            </MakeScrapButton>
          </div>
        </FloatingActionButtonLayout>
      )}
    </>
  );
};

const MakeScrapButton = styled.div`
  display: flex;
  gap: 6px;
`;

const MakeScrapButtonIconWrap = styled.div`
  display: flex;
`;

const MakeScrapButtonWrap = styled.div`
  margin: auto 0;
  display: flex;
`;

const MakeScrapButtonTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  font-size: 12px;

  color: ${({ theme }) => theme.grey.Grey8};
`;

export default ProfileMakeScrapFloatingButton;
