import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import { POST_COMPOSE_PATH } from 'const/PathConst';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import {
  isActivPostComposeBySourceUrlPopupAtom,
  isActivPostComposePopupAtom,
} from 'states/PostComposeAtom';
import styled from 'styled-components';

const PostComposePopupBody: React.FC = () => {
  const navigate = useNavigate();
  const setIsActivePostComposeBySourceUrlPopup = useSetRecoilState(
    isActivPostComposeBySourceUrlPopupAtom,
  );
  const setIsActivePostComposePopup = useSetRecoilState(
    isActivPostComposePopupAtom,
  );
  return (
    <PostComposePopupContainer>
      <PostComposeTitle>포스트 게시</PostComposeTitle>
      <PostComposePopupWrap>
        <PostComposeCreateTypeWrap
          onClick={() => {
            navigate(POST_COMPOSE_PATH);
          }}
        >
          사진
        </PostComposeCreateTypeWrap>
        <PostComposeCreateTypeWrap
          onClick={() => {
            setIsActivePostComposePopup(false);
            setIsActivePostComposeBySourceUrlPopup(true);
          }}
        >
          사이트
        </PostComposeCreateTypeWrap>
      </PostComposePopupWrap>
      <MyAccountSettingInfoState />
    </PostComposePopupContainer>
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
  cursor: pointer;
`;

export default PostComposePopupBody;
