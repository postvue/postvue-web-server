import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import { POST_COMPOSE_PATH } from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  isActivPostComposeBySourceUrlPopupAtom,
  isActivPostComposePopupAtom,
  isActivPostComposeSelectPopupAtom,
} from 'states/PostComposeAtom';
import styled from 'styled-components';

interface PostComposePopupBodyProps {
  setIsExternalCloseFunc?: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostComposePopupBody: React.FC<PostComposePopupBodyProps> = ({
  setIsExternalCloseFunc,
}) => {
  const navigate = useNavigate();
  const [isActivePostComposeSelectPopup, setIsActivePostComposeSelectPopup] =
    useRecoilState(isActivPostComposeSelectPopupAtom);
  const setIsActivePostComposeBySourceUrlPopup = useSetRecoilState(
    isActivPostComposeBySourceUrlPopupAtom,
  );

  const setIsActivePostComposePopup = useSetRecoilState(
    isActivPostComposePopupAtom,
  );

  const { windowWidth } = useWindowSize();

  return (
    <>
      <PostComposePopupContainer>
        <PostComposeTitle>포스트 게시</PostComposeTitle>
        <PostComposePopupWrap>
          <PostComposeCreateTypeWrap
            onClick={() => {
              setIsActivePostComposeSelectPopup(false);
              if (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM) {
                if (setIsExternalCloseFunc) {
                  setIsExternalCloseFunc(true);
                }

                setIsActivePostComposePopup(true);
              } else {
                navigate(POST_COMPOSE_PATH);
              }
            }}
          >
            사진
          </PostComposeCreateTypeWrap>
          <PostComposeCreateTypeWrap
            onClick={() => {
              if (setIsExternalCloseFunc) {
                setIsExternalCloseFunc(true);
              }
              setIsActivePostComposeSelectPopup(false);
              setIsActivePostComposeBySourceUrlPopup(true);
            }}
          >
            사이트
          </PostComposeCreateTypeWrap>
        </PostComposePopupWrap>
        {isActivePostComposeSelectPopup && <MyAccountSettingInfoState />}
      </PostComposePopupContainer>
    </>
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
  padding: 0 0 50px 20px;
`;

const PostComposeTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline1};
  text-align: center;
  padding: 0px 0 41px 0;
`;

const PostComposeCreateTypeWrap = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body5};
  cursor: pointer;
`;

export default PostComposePopupBody;
