import PoseComposeBody from 'components/posecompose/PoseComposeBody';
import PoseComposeHeader from 'components/posecompose/PoseComposeHeader';
import {
  POST_COMPOSE_BUTTON_PHRASE,
  POST_COMPOSE_HEADER_TITLE_PHRASE,
} from 'const/PostComposeConst';
import {
  UPLOAD_IMG_MAX_HEIGHT,
  UPLOAD_IMG_MAX_WIDTH,
} from 'const/SystemAttrConst';
import { POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_ID } from 'const/TabConfigConst';
import {
  PostContentInterface,
  SnsPostComposeCreateReqInterface,
} from 'global/interface/post';
import { resizeImage } from 'global/util/ImageInputUtil';
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { createPostCompose } from 'services/post/createPostCompose';
import {
  postComposeAddressRelationAtom,
  uploadResourceListAtom,
} from 'states/PostComposeAtom';

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
  const [uploadResourceList, setUploadResourceList] = useRecoilState(
    uploadResourceListAtom,
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
          console.log(value);
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
        setIsLoadingPopup(false);
        actionFuncByCompose();
      })
      .catch((error: any) => {
        console.log(error.response?.status);
        console.log(error.response?.data);
        alert(error.response?.data?.message);
        setIsLoadingPopup(false);
      });
  };

  return (
    <>
      <PoseComposeHeader
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
    </>
  );
};

export default PostComposePageBody;
