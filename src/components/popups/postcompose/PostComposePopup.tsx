import React from 'react';
import { useSetRecoilState } from 'recoil';
import {
  isActivPostComposeBySourceUrlPopupAtom,
  isActivPostComposePopupAtom,
} from 'states/PostComposeAtom';
import styled from 'styled-components';
import PopupLayout from '../../layouts/PopupLayout';

const popupWrapStyle: React.CSSProperties = {
  height: 'auto',
};

const PostComposePopup: React.FC = () => {
  const setIsActivePostComposeBySourceUrlPopup = useSetRecoilState(
    isActivPostComposeBySourceUrlPopupAtom,
  );
  const setIsActivePostComposePopup = useSetRecoilState(
    isActivPostComposePopupAtom,
  );

  return (
    <PopupLayout
      setIsPopup={setIsActivePostComposePopup}
      isTouchScrollBar={true}
      popupWrapStyle={popupWrapStyle}
    >
      <PostComposePopupContainer>
        <PostComposeTitle>포스트 게시</PostComposeTitle>
        <PostComposePopupWrap>
          <PostComposeCreateTypeWrap>사진</PostComposeCreateTypeWrap>
          <PostComposeCreateTypeWrap
            onClick={() => setIsActivePostComposeBySourceUrlPopup(true)}
          >
            사이트
          </PostComposeCreateTypeWrap>
        </PostComposePopupWrap>
      </PostComposePopupContainer>
    </PopupLayout>
  );
};

const PostComposePopupContainer = styled.div`
  display: flex;
  flex-flow: column;
`;

const PostComposePopupWrap = styled.div`
  display: flex;
  flex-flow: column;
  gap: 33px;
  padding: 0 0 87px 20px;
`;

const PostComposeTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline1};
  text-align: center;
  padding: 32px 0 41px 0;
`;

const PostComposeCreateTypeWrap = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body5};
`;

export default PostComposePopup;
