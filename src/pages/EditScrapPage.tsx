import { ReactComponent as PostScrapButtonWhiteIcon } from 'assets/images/icon/svg/post/PostClipButton20x20WhiteIcon.svg';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import ConfirmPopup from 'components/popups/ConfirmPopup';
import LoadingPopup from 'components/popups/LoadingPopup';
import { notify } from 'components/popups/ToastMsgPopup';
import ProfileEditScrapBody from 'components/profile/ProfileEditScrapBody';
import { PROFILE_SCRAP_LIST_PATH } from 'const/PathConst';
import { SCRAP_PAGE_NAME } from 'const/ReactNativeConst';
import { DELETE_SCRAP } from 'const/SystemPhraseConst';
import { fetchProfileClipListInfinite } from 'global/util/channel/static/fetchProfileClipListInfinite';
import { fetchProfileScrapListInfinite } from 'global/util/channel/static/fetchProfileScrapListInfinite';
import { fetchScrapPreviewList } from 'global/util/channel/static/fetchScrapPreviewList';
import { refetchProfileScrap } from 'global/util/channel/static/refetchProfileScrap';
import { isApp, navigateToMainTab } from 'global/util/reactnative/nativeRouter';
import { isValidString } from 'global/util/ValidUtil';
import useBodyAdaptProps from 'hook/customhook/useBodyAdaptProps';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteProfileScrap } from 'services/profile/deleteProfileScrap';
import styled from 'styled-components';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
const EditScrapPage: React.FC = () => {
  const navigate = useNavigate();
  const param = useParams();
  const scrapId = param.scrapId;
  const [isDeleteScrapPopup, setIsDeleteScrapPopup] = useState<boolean>(false);
  const [isLoadingPopup, setIsLodingPopup] = useState<boolean>(false);

  const onClickDeleteScrap = () => {
    if (!scrapId || !isValidString(scrapId)) return;
    setIsLodingPopup(true);
    deleteProfileScrap(scrapId).then(() => {
      setIsDeleteScrapPopup(false);

      fetchProfileScrapListInfinite();

      refetchProfileScrap(scrapId);
      fetchScrapPreviewList(scrapId);
      fetchProfileClipListInfinite();

      setIsLodingPopup(false);
      if (isApp()) {
        navigateToMainTab(navigate, SCRAP_PAGE_NAME, PROFILE_SCRAP_LIST_PATH);
      } else {
        setTimeout(() => {
          navigate(PROFILE_SCRAP_LIST_PATH, { replace: true });
        }, 100);

        setTimeout(() => {
          notify({
            msgIcon: <PostScrapButtonWhiteIcon />,
            msgTitle: DELETE_SCRAP,
          });
        }, 200);
      }
    });
  };

  useBodyAdaptProps([
    { key: 'overscroll-behavior', value: 'none' },
    { key: 'overflow', value: 'hidden' },
  ]);

  return (
    <AppBaseTemplate isAppInsetTopMargin={false}>
      <PrevButtonHeaderHeader
        titleName={'스크랩 수정'}
        RightButtonNode={
          <DeleteScrapButotn onClick={() => setIsDeleteScrapPopup(true)}>
            삭제
          </DeleteScrapButotn>
        }
      />
      {scrapId && <ProfileEditScrapBody scrapId={scrapId} />}
      {isDeleteScrapPopup && (
        <ConfirmPopup
          confirmPopupTitle={'스크랩을 삭제하시나요?'}
          confirmPopupSubTitle={
            '삭제시 스크랩은 복구 되지 않습니다.\n그래도 삭제하시겠습니까?'
          }
          onClose={() => setIsDeleteScrapPopup(false)}
          actionFunc={onClickDeleteScrap}
        />
      )}
      {isLoadingPopup && <LoadingPopup />}
    </AppBaseTemplate>
  );
};

const DeleteScrapButotn = styled.div`
  background-color: black;
  color: white;
  margin: auto 0;
  padding: 3px 9px;
  border-radius: 19px;
  font:${({ theme }) => theme.fontSizes.Body3}
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  cursor:pointer;

`;

export default EditScrapPage;
