import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PostEditPageBody from 'components/popups/postedit/PostEditPageBody';
import PostVideoEditPageBody from 'components/popups/postedit/PostVideoEditPageBody';
import { HOME_PATH } from 'const/PathConst';
import { POST_VIDEO_TYPE } from 'const/PostContentTypeConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { fetchProfilePost } from 'global/util/channel/static/fetchProfilePost';
import { fetchScrapPreviewList } from 'global/util/channel/static/fetchScrapPreviewList';
import { useGoBackOrNavigate } from 'global/util/HistoryStateUtil';
import { isApp, stackRouterBack } from 'global/util/reactnative/nativeRouter';
import { isValidString } from 'global/util/ValidUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStatePostInfo } from 'hook/queryhook/QueryStateProfilePostInfo';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PostEditPage: React.FC = () => {
  const navigate = useNavigate();
  const goBackOrNavigate = useGoBackOrNavigate(HOME_PATH);
  const param = useParams();
  const postId = param.post_id;

  const { data: profilePostInfo, isFetched: isFechedByProfilePostInfo } =
    QueryStatePostInfo(postId || '');

  const { windowWidth } = useWindowSize();

  useEffect(() => {
    if (windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM) return;
    navigate(-1);
  }, []);

  const actionFunc = () => {
    if (isApp()) {
      if (postId) {
        fetchProfilePost(postId);
        fetchScrapPreviewList(postId);
      }

      stackRouterBack(navigate);
    } else {
      goBackOrNavigate();
    }
  };

  return (
    <AppBaseTemplate
      isAppInsetTopMargin={false}
      AppContainerStyle={{ display: 'flex', flexDirection: 'column' }}
    >
      {postId && isValidString(postId) && (
        <>
          {isFechedByProfilePostInfo && profilePostInfo && (
            <>
              {profilePostInfo.postContents.some(
                (v) => v.postContentType === POST_VIDEO_TYPE,
              ) ? (
                <PostVideoEditPageBody
                  postId={postId}
                  actionFuncByCompose={actionFunc}
                  onClose={() => stackRouterBack(navigate)}
                />
              ) : (
                <PostEditPageBody
                  postId={postId}
                  actionFuncByCompose={actionFunc}
                  onClose={() => stackRouterBack(navigate)}
                />
              )}
            </>
          )}
        </>
      )}
    </AppBaseTemplate>
  );
};

export default PostEditPage;
