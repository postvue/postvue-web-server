import { ReactComponent as PostComposeImageIcon } from 'assets/images/icon/svg/post/compose/PostComposeImageIcon.svg';
import { ReactComponent as PostComposeLinkIcon } from 'assets/images/icon/svg/post/compose/PostComposeLinkIcon.svg';
import { ReactComponent as PostComposeVideoIcon } from 'assets/images/icon/svg/post/compose/PostComposeVideoIcon.svg';
import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import {
  POST_COMPOSE_PATH,
  POST_COMPOSE_SOURCE_URL_PATH,
  POST_VIDEO_COMPOSE_PATH,
} from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { isApp, stackRouterPush } from 'global/util/reactnative/nativeRouter';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  isActivPostComposeBySourceUrlPopupAtom,
  isActivPostComposePopupAtom,
  isActivPostComposeSelectPopupAtom,
  isActivPostVideoComposePopupAtom,
  isNotSupportVideoConfirmPopupAtom,
} from 'states/PostComposeAtom';
import styled from 'styled-components';
import PopupBodyTemplate from '../PopupBodyTemplate';

interface PostComposeSelectPopupBodyProps {
  onClose: () => void;
}

const PostComposeSelectPopupBody: React.FC<PostComposeSelectPopupBodyProps> = ({
  onClose,
}) => {
  const navigate = useNavigate();
  const [isActivePostComposeSelectPopup, setIsActivePostComposeSelectPopup] =
    useRecoilState(isActivPostComposeSelectPopupAtom);
  const setIsActivePostComposeBySourceUrlPopup = useSetRecoilState(
    isActivPostComposeBySourceUrlPopupAtom,
  );

  const setIsActivPostComposePopup = useSetRecoilState(
    isActivPostComposePopupAtom,
  );
  const setIsActivPostVideoComposePopup = useSetRecoilState(
    isActivPostVideoComposePopupAtom,
  );

  const { windowWidth } = useWindowSize();

  const setIsNotSupportVideoConfirmPopup = useSetRecoilState(
    isNotSupportVideoConfirmPopupAtom,
  );

  return (
    <>
      <PostComposePopupContainer>
        <PopupBodyTemplate
          elementList={[
            {
              title: '사진',
              Icon: PostComposeImageIcon,
              onFunc: () => {
                onClose();
                if (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM) {
                  setIsActivPostComposePopup(true);
                } else {
                  stackRouterPush(navigate, POST_COMPOSE_PATH);
                }
              },
            },
            {
              title: '영상',
              Icon: PostComposeVideoIcon,
              onFunc: () => {
                onClose();
                if (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM) {
                  setIsActivPostVideoComposePopup(true);
                } else {
                  if (isApp()) {
                    stackRouterPush(navigate, POST_VIDEO_COMPOSE_PATH);
                  } else {
                    setIsNotSupportVideoConfirmPopup(true);
                  }
                }
              },
            },
            {
              title: '링크',
              Icon: PostComposeLinkIcon,
              onFunc: () => {
                onClose();
                if (isApp()) {
                  stackRouterPush(navigate, POST_COMPOSE_SOURCE_URL_PATH);
                } else {
                  setIsActivePostComposeBySourceUrlPopup(true);
                }
              },
            },
          ]}
        />

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
  padding: 0px 0 20px 0;
`;

const PostComposeCreateTypeWrap = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body5};
  cursor: pointer;
`;

export default PostComposeSelectPopupBody;
