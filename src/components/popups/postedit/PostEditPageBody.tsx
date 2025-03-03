import PostComposeBody from 'components/posecompose/PostComposeBody';
import PostComposeHeader from 'components/posecompose/PostComposeHeader';
import {
  UPLOAD_IMG_MAX_HEIGHT,
  UPLOAD_IMG_MAX_WIDTH,
} from 'const/SystemAttrConst';
import { POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_ID } from 'const/TabConfigConst';
import {
  PostUploadContent,
  SnsPostComposeUpdateReqInterface,
} from 'global/interface/post';
import { fetchProfileAccountListInfinite } from 'global/util/channel/static/fetchProfileAccountListInfinite';
import { fetchProfilePost } from 'global/util/channel/static/fetchProfilePost';
import { resizeImage } from 'global/util/ImageInputUtil';
import { QueryStatePostInfo } from 'hook/queryhook/QueryStateProfilePostInfo';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { editPostCompose } from 'services/post/editPostCompose copy';
import { postComposeAddressRelationAtom } from 'states/PostComposeAtom';
import { selectScrapByComposePopupInfoAtom } from 'states/ProfileAtom';

interface PostEditPageBodyProps {
  postId: string;
  hasTransparentOverLay?: boolean;
  hasPrevButton?: boolean;
  actionFuncByCompose: () => void;
  onClose?: () => void;
}

const PostEditPageBody: React.FC<PostEditPageBodyProps> = ({
  postId,
  hasTransparentOverLay = false,
  hasPrevButton = true,
  actionFuncByCompose,
  onClose = () => {
    ('');
  },
}) => {
  const { data: profilePostInfo, isError: isErrorByProfilePost } =
    QueryStatePostInfo(postId);

  const [uploadContentList, setUploadContentList] = useState<
    PostUploadContent[]
  >([]);
  const [postTitle, setPostTitle] = useState<string>('');
  const [postBodyText, setPostBodyText] = useState<string>('');
  const [postTagList, setPostTagList] = useState<string[]>([]);

  const [targetAudienceId, setTargetAudienceId] = useState<number>(
    POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_ID,
  );

  const [postComposeAddressRelation, setPostComposeAddressRelation] =
    useRecoilState(postComposeAddressRelationAtom);

  const [selectScrapByComposePopupInfo, setSelectScrapByComposePopupInfo] =
    useRecoilState(selectScrapByComposePopupInfoAtom);

  const [isLoadingPopup, setIsLoadingPopup] = useState<boolean>(false);

  const onClickUploadButton = async () => {
    if (!postId) {
      alert('오류로 인해 수정에 실패 했습니다.');
      return;
    }
    const formData = new FormData();
    // @REFER: 수정 바람
    const snsPostComposeUpdateReq: SnsPostComposeUpdateReqInterface = {
      address: postComposeAddressRelation.roadAddr,
      buildName: postComposeAddressRelation.buildName,
      latitude: postComposeAddressRelation.latitude,
      longitude: postComposeAddressRelation.longitude,
      tagList: postTagList,
      title: postTitle,
      bodyText: postBodyText,
      existPostContentList: uploadContentList
        .filter((value) => value.isExist === true)
        .map((v) => {
          return v.contentUrl;
        }),
      externalImgLinkList: [],
      scrapIdList: selectScrapByComposePopupInfo.scrapInfoList.map(
        (v) => v.scrapId,
      ),
      targetAudienceValue: targetAudienceId,
    };

    const snsPostComposeUpdateBlob = new Blob(
      [JSON.stringify(snsPostComposeUpdateReq)],
      {
        type: 'application/json',
      },
    );
    formData.append('snsPostComposeUpdateReq', snsPostComposeUpdateBlob);

    for (const uploadFile of uploadContentList.filter(
      (value) => value.isExist === false,
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
    editPostCompose(postId, formData)
      .then(() => {
        setIsLoadingPopup(false);
        actionFuncByCompose();
        fetchProfilePost(postId);

        if (!profilePostInfo) return;
        fetchProfileAccountListInfinite(profilePostInfo.username);
      })
      .catch((error: any) => {
        alert(error.response?.data?.message);
        setIsLoadingPopup(false);
      });
  };

  useEffect(() => {
    if (!profilePostInfo) return;
    setPostTitle(profilePostInfo.postTitle);
    setPostBodyText(profilePostInfo.postBodyText);
    setPostTagList(profilePostInfo.tags);
    setTargetAudienceId(profilePostInfo.targetAudTypeId);
    setPostComposeAddressRelation({
      roadAddr: profilePostInfo.location.address,
      buildName: profilePostInfo.location.buildName,
      latitude: profilePostInfo.location.latitude,
      longitude: profilePostInfo.location.longitude,
    });
    setUploadContentList(
      profilePostInfo.postContents.map((v, i) => {
        return {
          contentUrl: v.content,
          contentType: v.postContentType,
          isLink: true,
          isUploadedLink: true,
          fileBlob: null,
          filename: v.content,
          sort: i,
          isExist: true,
        };
      }),
    );
    setTargetAudienceId(profilePostInfo.targetAudTypeId);
    setSelectScrapByComposePopupInfo((prev) => ({
      ...prev,
      scrapInfoList: profilePostInfo.scrapBoardIdList,
    }));
  }, [profilePostInfo]);

  useEffect(() => {
    if (!isErrorByProfilePost) return;
    onClose();
  }, [isErrorByProfilePost]);

  return (
    <>
      <PostComposeHeader
        titleName={'게시물'}
        hasPrevButton={hasPrevButton}
        actionFunc={onClose}
      />
      <PostComposeBody
        postTitle={postTitle}
        setPostTitle={setPostTitle}
        postBodyText={postBodyText}
        setPostBodyText={setPostBodyText}
        postTagList={postTagList}
        setPostTagList={setPostTagList}
        postUploadContentList={uploadContentList}
        setPostUploadContentList={setUploadContentList}
        targetAudienceId={targetAudienceId}
        setTargetAudienceId={setTargetAudienceId}
        isLoadingPopup={isLoadingPopup}
        setIsLoadingPopup={setIsLoadingPopup}
        onClickActionFunc={onClickUploadButton}
        composeButtonTitle={'게시물 수정'}
        hasTransparentOverLay={hasTransparentOverLay}
      />
    </>
  );
};

export default PostEditPageBody;
