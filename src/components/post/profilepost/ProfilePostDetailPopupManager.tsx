import ErrorMsgPopup from 'components/popups/ErrorMsgPopup';
import LoadingPopup from 'components/popups/LoadingPopup';
import MapExploreByProfilePostPopup from 'components/popups/mapexplore/MapExploreByProfilePostPopup';
import PostCommentThreadPopup from 'components/popups/postcommentthreadpopup/PostCommentThreadPopup';
import PostReactionCommentSettingPopup from 'components/popups/postreactionpopup/PostReactionCommentSettingPopup';
import PostReactionPopup from 'components/popups/postreactionpopup/PostReactionPopup';
import PostCommentComplaintPopup from 'components/popups/profilepost/PostCommentComplaintPopup';
import PostComplaintPopup from 'components/popups/profilepost/PostComplaintPopup';
import PostMapGuideSelectPopup from 'components/popups/profilepost/postselectmapcontentpopup/PostMapGuideSelectPopup';
import PostSelectMapContentPopup from 'components/popups/profilepost/postselectmapcontentpopup/PostSelectMapContentPopup';
import ProfilePostSettingPopup from 'components/popups/ProfilePostSettingPopup';
import { POST_VIDEO_TYPE } from 'const/PostContentTypeConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { PostCommentReplyMsgInfo, PostRsp } from 'global/interface/post';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { isMapExplorePopupAtom } from 'states/MapExploreAtom';
import {
  activePostCommentComplaintPopupAtom,
  activePostComplaintPopupAtom,
  activePostMapGuideSelectPopupInfoAtom,
  activePostSelectMapContentPopupInfoAtom,
  commentSettingPopupInfoAtom,
  isActivePostDeletePopupAtom,
  isSettingPopupAtom,
} from 'states/PostAtom';
import {
  isPostReactionAtom,
  reactionPostIdAtom,
} from 'states/PostReactionAtom';
import { activeCommentByPostCommentThreadAtom } from 'states/PostThreadAtom';
import { isLoadingPopupAtom } from 'states/SystemConfigAtom';
import ProfilePostDeleteConfirmPopup from './ProfilePostDeleteConfirmPopup';

interface ProfilePostDetailPopupManagerProps {
  postId: string;
  snsPost: PostRsp;
  replyMsg: PostCommentReplyMsgInfo | null;
  setReplyMsg: React.Dispatch<
    React.SetStateAction<PostCommentReplyMsgInfo | null>
  >;
  likeIconRef: React.MutableRefObject<{
    [key: string]: SVGSVGElement | null;
  }>;
  likeCountRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  commentReplyCountRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  postCommentTextareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  isClosed?: boolean;
  funcPrevCloseButton: () => void;
  fixNum?: number;

  windowWidthSize: number;
  setIsInterest: React.Dispatch<React.SetStateAction<boolean>>;
  isError: boolean;
  errorMsg: string;
}

const ProfilePostDetailPopupManager: React.FC<
  ProfilePostDetailPopupManagerProps
> = ({
  postId,
  snsPost,
  replyMsg,
  setReplyMsg,
  likeIconRef,
  likeCountRef,
  commentReplyCountRef,
  postCommentTextareaRef,
  windowWidthSize,
  setIsInterest,
  funcPrevCloseButton,
  isError,
  errorMsg,
}) => {
  const activeCommentByPostCommentThread = useRecoilValue(
    activeCommentByPostCommentThreadAtom,
  );

  const isSettingActive = useRecoilValue(isSettingPopupAtom);

  const activePostComplaintPopup = useRecoilValue(activePostComplaintPopupAtom);
  const activePostCommentComplaintPopup = useRecoilValue(
    activePostCommentComplaintPopupAtom,
  );

  const reactionPostId = useRecoilValue(reactionPostIdAtom);

  const isPostReactionPopup = useRecoilValue(isPostReactionAtom);

  const isActivePostDeletePopup = useRecoilValue(isActivePostDeletePopupAtom);

  const isLoadingPopup = useRecoilValue(isLoadingPopupAtom);

  const isMapExplorePopup = useRecoilValue(isMapExplorePopupAtom);

  const activePostSelectMapContentPopupInfo = useRecoilValue(
    activePostSelectMapContentPopupInfoAtom,
  );

  const activePostMapGuideSelectPopupInfo = useRecoilValue(
    activePostMapGuideSelectPopupInfoAtom,
  );

  const commentSettingPopupInfo = useRecoilValue(commentSettingPopupInfoAtom);

  return (
    <>
      {/* 게시물 설정 팝업 */}
      {windowWidthSize <= MEDIA_MOBILE_MAX_WIDTH_NUM &&
        postId &&
        isSettingActive && (
          <ProfilePostSettingPopup
            postId={postId}
            type={
              snsPost.postContents.some(
                (v) => v.postContentType === POST_VIDEO_TYPE,
              )
                ? 'video'
                : 'image'
            }
            userId={snsPost.userId}
            username={snsPost.username}
            setIsInterest={setIsInterest}
          />
        )}

      {/* 신고 팝업 */}
      {activePostComplaintPopup.isActive && (
        <PostComplaintPopup postId={postId} />
      )}
      {activePostCommentComplaintPopup.isActive && (
        <PostCommentComplaintPopup />
      )}
      {/* {isActivePostComplaintCompletePopup && (
        <ComplaintCompletePopup
          userInfo={{ userId: snsPost.userId, username: snsPost.username }}
        />
      )} */}

      {/* 포스트 반응 팝업: 댓글, 리포스트, 하트 */}
      {windowWidthSize <= MEDIA_MOBILE_MAX_WIDTH_NUM && isPostReactionPopup && (
        <PostReactionPopup
          postId={reactionPostId}
          username={snsPost.username}
          replyMsg={replyMsg}
          setReplyMsg={setReplyMsg}
        />
      )}
      {activeCommentByPostCommentThread.isActive && (
        <PostCommentThreadPopup
          snsPost={snsPost}
          postCommentTextareaRef={postCommentTextareaRef}
          replyMsg={replyMsg}
          setReplyMsg={setReplyMsg}
          likeIconByCommentRef={likeIconRef}
          likeCountByCommentRef={likeCountRef}
          commentCountByCommentRef={commentReplyCountRef}
        />
      )}

      {/* 포스트 삭제 팝업 */}
      {isActivePostDeletePopup && (
        <ProfilePostDeleteConfirmPopup postId={postId} />
      )}

      {isMapExplorePopup && <MapExploreByProfilePostPopup snsPost={snsPost} />}

      {isLoadingPopup && (
        <LoadingPopup LoadingPopupStyle={{ backgroundColor: 'transparent' }} />
      )}
      {activePostSelectMapContentPopupInfo.isActive && (
        <PostSelectMapContentPopup />
      )}
      {activePostMapGuideSelectPopupInfo.isActive && (
        <PostMapGuideSelectPopup />
      )}

      {commentSettingPopupInfo.isActive && <PostReactionCommentSettingPopup />}

      {isError && (
        <ErrorMsgPopup
          errorMsgPopupTitle={'Error'}
          errorMsgPopupSubTitle={errorMsg}
          onClose={funcPrevCloseButton}
        />
      )}
    </>
  );
};
export default ProfilePostDetailPopupManager;
