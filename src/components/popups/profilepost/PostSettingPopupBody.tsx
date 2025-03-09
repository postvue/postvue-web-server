import { ReactComponent as LinkButtonIcon } from 'assets/images/icon/svg/LinkButtonIcon.svg';
import { ReactComponent as PostClipButtonIcon } from 'assets/images/icon/svg/post/PostClipButton20x20Icon.svg';
import { ReactComponent as PostClipDeleteButtonIcon } from 'assets/images/icon/svg/post/PostClipDeleteButton20x20Icon.svg';
import { ReactComponent as ProfilePostShareButtonIcon } from 'assets/images/icon/svg/post/ProfilePostShareButtonIcon.svg';
import { PROFILE_POST_LIST_PATH } from 'const/PathConst';
import {
  POST_DETAIL_POPUP_PARAM,
  POST_DETAIL_POST_ID_PARAM,
  POST_DETAIL_PROFILE_PARAM,
  TRUE_PARAM,
} from 'const/QueryParamConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM, SERVER_PATH } from 'const/SystemAttrConst';
import { PostRsp } from 'global/interface/post';
import {
  isApp,
  sendBasicShareEvent,
} from 'global/util/reactnative/nativeRouter';
import { handleShareUtil, ShareInfo } from 'global/util/ShareUtil';
import { onClickClipBoardCopyButton } from 'global/util/ToastUtil';
import { getOriginFromUrl } from 'global/util/UrlUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
import { generatePath } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  activePostDotSettingInfoAtom,
  isActiveDeleteClipByScrapPopupAtom,
} from 'states/PostAtom';
import { activeScrapViewPopupInfoAtom } from 'states/ProfileAtom';
import { sharePopupInfoAtom } from 'states/ShareAtom';
import styled from 'styled-components';
import theme from 'styles/theme';

interface PostSettingPopupBodyProps {
  snsPostRsp: PostRsp;
  onClose: () => void;
}

const PostSettingPopupBody: React.FC<PostSettingPopupBodyProps> = ({
  snsPostRsp,
  onClose,
}) => {
  const setActiveScrapViewPopupInfo = useSetRecoilState(
    activeScrapViewPopupInfoAtom,
  );

  const setSharePopupInfo = useSetRecoilState(sharePopupInfoAtom);

  const setIsActiveDeleteClipByScrapPopup = useSetRecoilState(
    isActiveDeleteClipByScrapPopupAtom,
  );

  const activePostDotSettingInfo = useRecoilValue(activePostDotSettingInfoAtom);

  const returnClipBoardUrl = (username: string, postId: string) => {
    return `${SERVER_PATH}${generatePath(PROFILE_POST_LIST_PATH, { user_id: username, post_id: postId })}`;
  };

  const onClickCopyPostLink = (username: string, postId: string) => {
    onClose();
    onClickClipBoardCopyButton(
      returnClipBoardUrl(username, postId),
      <LinkButtonIcon />,
    );
  };

  const onClickAddScrap = () => {
    onClose();
    setActiveScrapViewPopupInfo({ isActive: true, snsPost: snsPostRsp });
  };

  const { windowWidth } = useWindowSize();
  return (
    <PostSettingPopupBodyContainer>
      <PostSettingContextWrap>
        {snsPostRsp.isClipped &&
        activePostDotSettingInfo.deletePostByScrapId ? (
          <PostSettingTab
            onClick={() => {
              setIsActiveDeleteClipByScrapPopup(true);
            }}
          >
            <PostSettingIconWrap>
              <PostClipDeleteButtonIcon />
            </PostSettingIconWrap>
            <PostSettingTitle
              style={{
                color: theme.mainColor.Red,
              }}
            >
              스크랩에서 삭제
            </PostSettingTitle>
          </PostSettingTab>
        ) : (
          <PostSettingTab onClick={onClickAddScrap}>
            <PostSettingIconWrap>
              <PostClipButtonIcon />
            </PostSettingIconWrap>
            <PostSettingTitle
              style={{
                color: theme.grey.Grey8,
              }}
            >
              저장
            </PostSettingTitle>
          </PostSettingTab>
        )}
        <PostSettingTab
          onClick={() => {
            onClose();

            // @REFER: 나중에 수정 바람
            // setSharePopupInfo({
            //   isActive: true,
            //   shareLink: returnClipBoardUrl(
            //     snsPostRsp.username,
            //     snsPostRsp.postId,
            //   ),
            //   mainImageUrl: getRandomImage(
            //     snsPostRsp.postContents
            //       .filter((value) => value.postContentType === POST_IMAGE_TYPE)
            //       .map((v) => v.content),
            //     snsPostRsp.profilePath,
            //   ),
            // });

            const searchParams = new URLSearchParams(location.search);

            // 새로운 쿼리 파라미터 추가 또는 기존 파라미터 값 수정
            searchParams.set(POST_DETAIL_POPUP_PARAM, TRUE_PARAM);
            searchParams.set(POST_DETAIL_POST_ID_PARAM, snsPostRsp.postId);
            searchParams.set(POST_DETAIL_PROFILE_PARAM, snsPostRsp.userId);

            // 새로운 쿼리 파라미터가 포함된 URL 생성
            const newSearch = searchParams.toString();
            const sharePath = `/?${newSearch}`;

            const shareInfo: ShareInfo = {
              text: '특별한 순간을 함께 눈으로 확인해 보실래요? ❤️',
              url:
                getOriginFromUrl(window.location.href) +
                (windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM
                  ? sharePath
                  : generatePath(PROFILE_POST_LIST_PATH, {
                      post_id: snsPostRsp.postId,
                      user_id: snsPostRsp.userId,
                    })),
            };
            if (isApp()) {
              sendBasicShareEvent(shareInfo);
            } else {
              handleShareUtil(shareInfo);
            }
          }}
        >
          <PostSettingIconWrap>
            <ProfilePostShareButtonIcon />
          </PostSettingIconWrap>
          <PostSettingTitle>공유</PostSettingTitle>
        </PostSettingTab>
        <PostSettingTab
          onClick={() =>
            onClickCopyPostLink(snsPostRsp.username, snsPostRsp.postId)
          }
        >
          <PostSettingIconWrap>
            <LinkButtonIcon />
          </PostSettingIconWrap>
          <PostSettingTitle>링크 복사</PostSettingTitle>
        </PostSettingTab>
      </PostSettingContextWrap>
    </PostSettingPopupBodyContainer>
  );
};

const PostSettingPopupBodyContainer = styled.div`
  position: relative;
  flex-shrink: 1;
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

const LinkButtonWrap = styled.div`
  display: flex;
  gap: 10px;
`;

const LinkButtonSubWrap = styled.div`
display
`;

const LinkButtonTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
`;

export default PostSettingPopupBody;
