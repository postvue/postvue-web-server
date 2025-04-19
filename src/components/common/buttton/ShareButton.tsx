import React from 'react';
import styled from 'styled-components';

import { ReactComponent as ProfilePostShareButtonIcon } from 'assets/images/icon/svg/post/ProfilePostShareButtonIcon.svg';
import { POST_IMAGE_TYPE } from 'const/PostContentTypeConst';
import { PostRsp } from 'global/interface/post';
import {
  getRandomImage,
  handleShareUtil,
  ShareInfo,
} from 'global/util/ShareUtil';
import {
  isApp,
  sendBasicShareEvent,
} from 'global/util/reactnative/nativeRouter';
import { useSetRecoilState } from 'recoil';
import { sharePopupInfoAtom } from 'states/ShareAtom';
import ReactionLongPressButtonTemplate from '../posts/body/ReactionLongPressButtonTemplate';

interface ShareButtonProps {
  shareLink: string;
  snsPost: PostRsp;
  title?: string;
  description?: string;
  address?: string;
  addressTitle?: string;
  onClickFunc?: () => void;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  shareLink,
  snsPost,
  title,
  description,
  address,
  addressTitle,
  onClickFunc,
}) => {
  const setSharePopupInfo = useSetRecoilState(sharePopupInfoAtom);

  const mainImageUrl = getRandomImage(
    snsPost.postContents
      .filter((v) => v.postContentType === POST_IMAGE_TYPE)
      .map((v) => v.content),
    snsPost.profilePath,
  );
  return (
    <ReactionLongPressButtonTemplate resize={0.85} resizeSpeedRate={0.2}>
      <ShareButtonWrap
        onClick={(e) => {
          e.stopPropagation();
          if (onClickFunc) {
            onClickFunc();
          }

          // setSharePopupInfo({
          //   isActive: true,
          //   shareLink: shareLink,
          //   mainImageUrl: mainImageUrl,
          //   title: title,
          //   description: description,
          //   address: address,
          // });

          const shareInfo: ShareInfo = {
            text: '특별한 순간을 함께 눈으로 확인해 보실래요? ❤️',
            url: window.location.href,
          };
          if (isApp()) {
            sendBasicShareEvent(shareInfo);
          } else {
            handleShareUtil(shareInfo);
          }
        }}
      >
        <ProfilePostShareButtonIcon />
      </ShareButtonWrap>
    </ReactionLongPressButtonTemplate>
  );
};

const ShareButtonWrap = styled.div`
  display: flex;
  cursor: pointer;
`;

export default ShareButton;
