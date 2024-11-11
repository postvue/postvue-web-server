import { AxiosError } from 'axios';
import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PoseComposeBody from 'components/posecompose/PoseComposeBody';
import PoseComposeHeader from 'components/posecompose/PoseComposeHeader';
import { POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_ID } from 'const/TabConfigConst';
import { PostContentInterface } from 'global/interface/post';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { createPostCompose } from 'services/post/createPostCompose';
import {
  postComposeAddressRelationAtom,
  uploadResourceListAtom,
} from 'states/PostComposeAtom';

const PostComposePage: React.FC = () => {
  const navigate = useNavigate();
  const [uploadResourceList, setUploadResourceList] = useRecoilState(
    uploadResourceListAtom,
  );
  const [postTitle, setPostTitle] = useState<string>('');
  const [postBodyText, setPostBodyText] = useState<string>('');
  const [postTagList, setPostTagList] = useState<string[]>([]);

  const [targetAudienceId, setTargetAudienceId] = useState<number>(
    POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_ID,
  );

  const poseComposeAddressRelation = useRecoilValue(
    postComposeAddressRelationAtom,
  );

  const [isLoadingPopup, setIsLoadingPopup] = useState<boolean>(false);

  const onClickUploadButton = () => {
    const formData = new FormData();
    const snsPostComposeCreateReq = {
      address: poseComposeAddressRelation.roadAddr,
      tagList: postTagList,
      title: postTitle,
      bodyText: postBodyText,
      postContentLinkList: uploadResourceList
        .filter((value) => value.isLink === true)
        .map((v, key) => {
          return {
            postContentType: v.contentType,
            content: v.contentUrl,
            ascSortNum: key,
          } as PostContentInterface;
        }),
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
      console.log(uploadFile, uploadFile.filename);
      formData.append('files', uploadFile.fileBlob);
    }

    setIsLoadingPopup(true);
    createPostCompose(formData)
      .then(() => {
        setIsLoadingPopup(false);
        navigate(-1);
      })
      .catch((error: AxiosError) => {
        console.log(error.response?.status);
        alert('에러');
        setIsLoadingPopup(false);
      });
  };

  return (
    <AppBaseTemplate>
      <PoseComposeHeader titleName={'새 게시물'} />
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
        composeButtonTitle={'게시물 업로드'}
      />
      <MyAccountSettingInfoState />
    </AppBaseTemplate>
  );
};

export default PostComposePage;
