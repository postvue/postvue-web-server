import { queryClient } from 'App';
import ConfirmPopup from 'components/popups/ConfirmPopup';
import {
  QUERY_STATE_POST_SCRAP_PREVIEW_LIST,
  QUERY_STATE_PROFILE_ACCOUNT_POST_LIST,
  QUERY_STATE_PROFILE_POST,
  QUERY_STATE_PROFILE_SCRAP_INFO,
  QUERY_STATE_PROFILE_SCRAP_LIST,
} from 'const/QueryClientConst';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { deletePost } from 'services/post/deletePost';
import { isActivePostDeletePopupAtom } from 'states/PostAtom';

interface ProfilePostDeleteConfirmPopupProps {
  postId: string;
}

const ProfilePostDeleteConfirmPopup: React.FC<
  ProfilePostDeleteConfirmPopupProps
> = ({ postId }) => {
  const navigate = useNavigate();
  const setIsActivePostDeletePopup = useSetRecoilState(
    isActivePostDeletePopupAtom,
  );

  const { data: myAccountSettingInfo } = QueryStateMyProfileInfo();

  return (
    <ConfirmPopup
      onClose={() => setIsActivePostDeletePopup(false)}
      confirmPopupTitle={'포스트를 삭제하시나요? '}
      confirmPopupSubTitle={
        '삭제시 포스트를 복구 할 수 없습니다. \n 그래도 정말 삭제하시나요?'
      }
      actionFunc={() => {
        if (!postId) return;
        deletePost(postId)
          .then(() => {
            setIsActivePostDeletePopup(false);
            queryClient.invalidateQueries({
              queryKey: [QUERY_STATE_PROFILE_POST, postId],
            });
            queryClient.invalidateQueries({
              queryKey: [QUERY_STATE_PROFILE_ACCOUNT_POST_LIST],
            });
            queryClient.invalidateQueries({
              queryKey: [QUERY_STATE_PROFILE_SCRAP_LIST],
            });
            queryClient.invalidateQueries({
              queryKey: [QUERY_STATE_PROFILE_SCRAP_INFO],
            });
            queryClient.invalidateQueries({
              queryKey: [QUERY_STATE_POST_SCRAP_PREVIEW_LIST],
            });
            navigate(-1);
            // navigate(PROFILE_LIST_PATH + '/' + myAccountSettingInfo?.username, {
            //   replace: true,
            // });
          })
          .catch(() => {
            setIsActivePostDeletePopup(false);
            alert('오류로 인해 포스트 삭제에 실패 했습니다.');
          });
      }}
    />
  );
};

export default ProfilePostDeleteConfirmPopup;
