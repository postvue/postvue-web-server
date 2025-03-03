import PoseComposeBody from 'components/posecompose/PostComposeBody';
import PostComposeHeader from 'components/posecompose/PostComposeHeader';
import {
  POST_COMPOSE_BUTTON_PHRASE,
  POST_COMPOSE_HEADER_TITLE_PHRASE,
} from 'const/PostComposeConst';
import {
  UPLOAD_IMG_MAX_HEIGHT,
  UPLOAD_IMG_MAX_WIDTH,
} from 'const/SystemAttrConst';
import { POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_ID } from 'const/TabConfigConst';
import { SnsPostComposeCreateReqInterface } from 'global/interface/post';
import { fetchProfileAccountListInfinite } from 'global/util/channel/static/fetchProfileAccountListInfinite';
import { fetchProfileScrapListInfinite } from 'global/util/channel/static/fetchProfileScrapListInfinite';
import { refetchProfileScrapInfo } from 'global/util/channel/static/refetchProfileScrapListInfo';
import { resizeImage } from 'global/util/ImageInputUtil';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { createPostCompose } from 'services/post/createPostCompose';
import {
  postComposeAddressRelationAtom,
  uploadResourceListAtom,
} from 'states/PostComposeAtom';
import { selectScrapByComposePopupInfoAtom } from 'states/ProfileAtom';
import styled from 'styled-components';

interface PostComposePageBodyProps {
  hasTransparentOverLay?: boolean;
  hasPrevButton?: boolean;
  actionFuncByCompose: () => void;
  onClose?: () => void;
}

const PostComposePageBody: React.FC<PostComposePageBodyProps> = ({
  hasTransparentOverLay = false,
  hasPrevButton = true,
  actionFuncByCompose,
  onClose = () => {
    ('');
  },
}) => {
  const { data: myProfileInfo } = QueryStateMyProfileInfo(); // 내 정보 가져오기
  const [uploadResourceList, setUploadResourceList] = useRecoilState(
    uploadResourceListAtom,
  );

  const selectScrapByComposePopupInfo = useRecoilValue(
    selectScrapByComposePopupInfoAtom,
  );

  const [postTitle, setPostTitle] = useState<string>('');
  const [postBodyText, setPostBodyText] = useState<string>('');
  const [postTagList, setPostTagList] = useState<string[]>([]);

  const [targetAudienceId, setTargetAudienceId] = useState<number>(
    POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_ID,
  );

  const postComposeAddressRelation = useRecoilValue(
    postComposeAddressRelationAtom,
  );

  const [isLoadingPopup, setIsLoadingPopup] = useState<boolean>(false);

  const onClickUploadButton = async () => {
    const formData = new FormData();
    const snsPostComposeCreateReq: SnsPostComposeCreateReqInterface = {
      address: postComposeAddressRelation.roadAddr,
      buildName: postComposeAddressRelation.buildName,
      latitude: postComposeAddressRelation.latitude,
      longitude: postComposeAddressRelation.longitude,
      tagList: postTagList,
      title: postTitle,
      bodyText: postBodyText,
      externalImgLinkList: uploadResourceList
        .filter((value) => value.isLink === true)
        .map((v) => {
          return v.contentUrl;
        }),
      scrapIdList: selectScrapByComposePopupInfo.scrapInfoList.map(
        (v) => v.scrapId,
      ),
      targetAudienceValue: targetAudienceId,
    };
    const snsPostComposeCreateBlob = new Blob(
      [JSON.stringify(snsPostComposeCreateReq)],
      {
        type: 'application/json',
      },
    );
    formData.append('snsPostComposeCreateReq', snsPostComposeCreateBlob);

    for (const uploadFile of uploadResourceList.filter(
      (value) => value.isLink === false,
    )) {
      if (!uploadFile.fileBlob || !uploadFile.filename) return;

      // 이미지 인 경우
      if (uploadFile.fileBlob.type.startsWith('image/')) {
        const resizeFile = new File(
          [uploadFile.fileBlob],
          uploadFile.filename,
          { type: uploadFile.fileBlob.type },
        );
        await resizeImage(
          resizeFile,
          UPLOAD_IMG_MAX_WIDTH,
          UPLOAD_IMG_MAX_HEIGHT,
        ).then((value) => {
          formData.append('files', value);
        });
      }
      // 비디오인 경우
      else {
        formData.append('files', uploadFile.fileBlob);
      }
    }

    setIsLoadingPopup(true);

    createPostCompose(formData)
      .then(() => {
        fetchProfileScrapListInfinite();
        if (myProfileInfo) {
          fetchProfileAccountListInfinite(myProfileInfo.username);
        }
        refetchProfileScrapInfo();

        actionFuncByCompose();
      })
      .catch((error: any) => {
        alert(error.response?.data?.message);
      })
      .finally(() => {
        setIsLoadingPopup(false);
      });
  };

  return (
    <PostComposePageBodyContainer>
      <PostComposeHeader
        titleName={POST_COMPOSE_HEADER_TITLE_PHRASE}
        hasPrevButton={hasPrevButton}
        actionFunc={onClose}
      />
      <PoseComposeBody
        postTitle={postTitle}
        setPostTitle={setPostTitle}
        postBodyText={postBodyText}
        setPostBodyText={setPostBodyText}
        postTagList={postTagList}
        setPostTagList={setPostTagList}
        postUploadContentList={uploadResourceList}
        setPostUploadContentList={setUploadResourceList}
        targetAudienceId={targetAudienceId}
        setTargetAudienceId={setTargetAudienceId}
        isLoadingPopup={isLoadingPopup}
        setIsLoadingPopup={setIsLoadingPopup}
        onClickActionFunc={onClickUploadButton}
        composeButtonTitle={POST_COMPOSE_BUTTON_PHRASE}
        hasTransparentOverLay={hasTransparentOverLay}
      />
    </PostComposePageBodyContainer>
  );
};

const PostComposePageBodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export default PostComposePageBody;
