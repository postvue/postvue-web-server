import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PostEditPageBody from 'components/popups/postedit/PostEditPageBody';
import { HOME_PATH } from 'const/PathConst';
import { useGoBackOrNavigate } from 'global/util/historyStateUtil';
import { isValidString } from 'global/util/ValidUtil';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PostEditPage: React.FC = () => {
  const navigate = useNavigate();
  const goBackOrNavigate = useGoBackOrNavigate(HOME_PATH);
  const param = useParams();
  const postId = param.post_id;

  return (
    <AppBaseTemplate>
      {postId && isValidString(postId) && (
        <PostEditPageBody
          postId={postId}
          actionFuncByCompose={() => goBackOrNavigate()}
          onClose={() => navigate(HOME_PATH)}
        />
      )}
    </AppBaseTemplate>
  );
};

export default PostEditPage;
