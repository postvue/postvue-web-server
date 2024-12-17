import { queryClient } from 'App';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import ConfirmPopup from 'components/popups/ConfirmPopup';
import LoadingPopup from 'components/popups/LoadingPopup';
import ProfileEditScrapBody from 'components/profile/ProfileEditScrapBody';
import { PROFILE_SCRAP_LIST_PATH } from 'const/PathConst';
import {
  QUERY_STATE_POST_SCRAP_PREVIEW_LIST,
  QUERY_STATE_PROFILE_SCRAP_INFO,
  QUERY_STATE_PROFILE_SCRAP_LIST,
} from 'const/QueryClientConst';
import { isValidString } from 'global/util/ValidUtil';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteProfileScrap } from 'services/profile/deleteProfileScrap';
import styled from 'styled-components';
import BodyFixScrollElement from '../components/BodyFixScrollElement';
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
      queryClient.invalidateQueries({
        queryKey: [QUERY_STATE_PROFILE_SCRAP_LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_STATE_PROFILE_SCRAP_INFO],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_STATE_POST_SCRAP_PREVIEW_LIST],
      });

      setIsLodingPopup(false);
      navigate(PROFILE_SCRAP_LIST_PATH, { replace: true });
    });
  };
  return (
    <AppBaseTemplate>
      <BodyFixScrollElement />
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
          setIsPopup={setIsDeleteScrapPopup}
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
