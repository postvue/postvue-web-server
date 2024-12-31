import { ReactComponent as LinkButtonIcon } from 'assets/images/icon/svg/LinkButtonIcon.svg';
import { ReactComponent as PostClipButtonIcon } from 'assets/images/icon/svg/post/PostClipButton20x20Icon.svg';
import { ReactComponent as ProfilePostShareButtonIcon } from 'assets/images/icon/svg/post/ProfilePostShareButtonIcon.svg';
import { ReactComponent as SettingHorizontalDotIcon } from 'assets/images/icon/svg/SettingHorizontalDotIcon.svg';
import ContextMenuPopup from 'components/popups/ContextMenuPopup';
import { POST_IMAGE_TYPE } from 'const/PostContentTypeConst';
import { MEDIA_MOBILE_MAX_WIDTH, SERVER_PATH } from 'const/SystemAttrConst';
import { MasonryPostRsp, PostRsp } from 'global/interface/post';
import { getRandomImage } from 'global/util/shareUtil';
import { onClickClipBoardCopyButton } from 'global/util/ToastUtil';
import React, { useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { isActiveScrapViewPopupByMasonryAtom } from 'states/ProfileAtom';
import { sharePopupInfoAtom } from 'states/ShareAtom';
import styled from 'styled-components';
import { hoverRoundCoverStyle } from 'styles/commonStyles';
import theme from 'styles/theme';

interface PostSettingButtonProps {
  masonryPostRsp: MasonryPostRsp;
  snsPostRsp: PostRsp;
  setSelectPostRsp: React.Dispatch<React.SetStateAction<PostRsp>>;
}

const PostSettingButton: React.FC<PostSettingButtonProps> = ({
  masonryPostRsp,
  snsPostRsp,
  setSelectPostRsp,
}) => {
  const [isActiveSettingContextMenuPopup, setIsActiveSettingContextMenuPopup] =
    useState<boolean>(false);

  const setIsActiveScrapViewPopupByMasonry = useSetRecoilState(
    isActiveScrapViewPopupByMasonryAtom,
  );

  const postSettingRef = useRef<HTMLDivElement>(null);

  const setSharePopupInfo = useSetRecoilState(sharePopupInfoAtom);

  const onClickCopyPostLink = () => {
    setIsActiveSettingContextMenuPopup(false);
    onClickClipBoardCopyButton(
      `${SERVER_PATH}/${masonryPostRsp.username}/${masonryPostRsp.postId}`,
    );
  };

  const onClickAddScrap = () => {
    setIsActiveSettingContextMenuPopup(false);
    setIsActiveScrapViewPopupByMasonry(true);
    setSelectPostRsp(snsPostRsp);
  };
  return (
    <PostSettingButtonContainer>
      <PostSettingButtonWrap
        ref={postSettingRef}
        onClick={() => {
          setSelectPostRsp(snsPostRsp);
          setIsActiveSettingContextMenuPopup(true);
        }}
      >
        <SettingHorizontalDotIcon />
      </PostSettingButtonWrap>
      {isActiveSettingContextMenuPopup && postSettingRef.current && (
        <ContextMenuPopup
          contextMenuRef={postSettingRef.current}
          setIsActive={setIsActiveSettingContextMenuPopup}
        >
          <PostSettingContextWrap>
            <PostSettingTab onClick={onClickAddScrap}>
              <PostSettingIconWrap>
                <PostClipButtonIcon stroke={theme.grey.Grey7} />
              </PostSettingIconWrap>
              <PostSettingTitle>저장</PostSettingTitle>
            </PostSettingTab>
            <PostSettingTab
              onClick={() => {
                setIsActiveSettingContextMenuPopup(false);
                setSharePopupInfo({
                  isActive: true,
                  shareLink: `${SERVER_PATH}/${snsPostRsp.username}/${snsPostRsp.postId}`,
                  mainImageUrl: getRandomImage(
                    snsPostRsp.postContents
                      .filter(
                        (value) => value.postContentType === POST_IMAGE_TYPE,
                      )
                      .map((v) => v.content),
                    snsPostRsp.profilePath,
                  ),
                  isFixed: true,
                });
              }}
            >
              <PostSettingIconWrap>
                <ProfilePostShareButtonIcon />
              </PostSettingIconWrap>
              <PostSettingTitle>공유</PostSettingTitle>
            </PostSettingTab>
            <PostSettingTab onClick={onClickCopyPostLink}>
              <PostSettingIconWrap>
                <LinkButtonIcon />
              </PostSettingIconWrap>
              <PostSettingTitle>링크 복사</PostSettingTitle>
            </PostSettingTab>
          </PostSettingContextWrap>
        </ContextMenuPopup>
      )}
    </PostSettingButtonContainer>
  );
};

const PostSettingButtonContainer = styled.div`
  display: flex;
  justify-content: end;
  position: relative;
  flex-shrink: 1;
`;

const PostSettingButtonWrap = styled.div`
  display: flex;
  margin: auto 0px;
  cursor: pointer;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    ${hoverRoundCoverStyle}
  }
`;

const PostSettingContextWrap = styled.div`
  padding: 5px 8px;
  display: flex;
  flex-flow: column;
  gap: 8px;
`;

const PostSettingTab = styled.div`
  padding: 8px 10px;
  display: flex;
  gap: 10px;
  cursor: pointer;
`;

const PostSettingIconWrap = styled.div`
  display: flex;
  margin: auto 0px;
`;

const PostSettingTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  color: ${({ theme }) => theme.grey.Grey8};
`;

export default PostSettingButton;
