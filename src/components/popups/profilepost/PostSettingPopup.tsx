import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';

import { STATUS_FORBIDDEN_CODE } from 'const/HttpStatusConst';
import { fetchProfilePost } from 'global/util/channel/static/fetchProfilePost';
import { fetchProfileScrapListInfinite } from 'global/util/channel/static/fetchProfileScrapListInfinite';
import { fetchScrapPreviewList } from 'global/util/channel/static/fetchScrapPreviewList';
import { refetchProfileScrap } from 'global/util/channel/static/refetchProfileScrap';
import { refetchProfileScrapList } from 'global/util/channel/static/refetchProfileScrapList';
import { deletePostToScrap } from 'services/profile/deletePostToScrap';
import {
  activePostDotSettingInfoAtom,
  isActiveDeleteClipByScrapPopupAtom,
} from 'states/PostAtom';
import ConfirmPopup from '../ConfirmPopup';
import PostSettingPopupBody from './PostSettingPopupBody';

const PostSettingPopup: React.FC = () => {
  const activePostDotSettingInfo = useRecoilValue(activePostDotSettingInfoAtom);
  const resetActivePostDotSettingInfo = useResetRecoilState(
    activePostDotSettingInfoAtom,
  );
  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  const { windowWidth } = useWindowSize();

  const [isActiveDeleteClipByScrapPopup, setIsActiveDeleteClipByScrapPopup] =
    useRecoilState(isActiveDeleteClipByScrapPopupAtom);

  const onDeleteScrap = (scrapId: string, postId: string) => {
    if (postId) {
      deletePostToScrap(scrapId, postId)
        .then(async (value) => {
          fetchScrapPreviewList(postId);
          refetchProfileScrap(scrapId);
          fetchProfileScrapListInfinite();
          refetchProfileScrapList();

          const postData = await fetchProfilePost(postId);
          setIsExternalCloseFunc(true);
          setIsActiveDeleteClipByScrapPopup(false);

          // setClipButtonState(value.isClipped, postData);

          // setIsScrapBoardActive(false);
        })
        .catch((err) => {
          const data: any = err.response?.data;
          if (err.status === STATUS_FORBIDDEN_CODE) {
            fetchProfilePost(postId);
          }
          alert(data.message);
        });
    }
  };

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <BottomSheetLayout
          isOpen={activePostDotSettingInfo.isActive}
          onClose={() => resetActivePostDotSettingInfo()}
          heightNum={
            200 +
              parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue(
                  '--safe-area-inset-bottom',
                ),
              ) || 0
          }
          isExternalCloseFunc={isExternalCloseFunc}
        >
          {activePostDotSettingInfo.selectedPost && (
            <PostSettingPopupBody
              snsPostRsp={activePostDotSettingInfo.selectedPost}
              onClose={() => setIsExternalCloseFunc(true)}
            />
          )}
        </BottomSheetLayout>
      ) : (
        <>
          {activePostDotSettingInfo.selectedPost && (
            <RoundSquareCenterPopupLayout
              onClose={() => resetActivePostDotSettingInfo()}
              popupOverLayContainerStyle={{ zIndex: '2000' }}
              popupWrapStyle={{ height: '200px', width: '300px' }}
            >
              <PostSettingPopupBody
                snsPostRsp={activePostDotSettingInfo.selectedPost}
                onClose={() => resetActivePostDotSettingInfo()}
              />
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
      {isActiveDeleteClipByScrapPopup && (
        <ConfirmPopup
          onClose={() => setIsActiveDeleteClipByScrapPopup(false)}
          popupOverLayContainerStyle={{ zIndex: 2000 }}
          confirmPopupTitle={'정말 스크랩에서 제거하시나요?'}
          confirmPopupSubTitle={
            '스크랩에서 제거된 이후에는 되돌릴 수 없습니다.'
          }
          actionFunc={() => {
            const post = activePostDotSettingInfo.selectedPost;
            const scrapId = activePostDotSettingInfo.deletePostByScrapId;

            if (!post || !scrapId) return;
            onDeleteScrap(scrapId, post.postId);
          }}
        />
      )}
    </>
  );
};

export default PostSettingPopup;
