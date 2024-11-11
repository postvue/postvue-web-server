import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PoseComposeBody from 'components/posecompose/PoseComposeBody';
import PoseComposeHeader from 'components/posecompose/PoseComposeHeader';
import { HOME_PATH } from 'const/PathConst';
import { POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_ID } from 'const/TabConfigConst';
import {
  PostComposeUploadByResourceLinkReq,
  PostContentInterface,
  PostUploadContent,
} from 'global/interface/post';
import { QueryStatePostInfo } from 'hook/queryhook/QueryStateProfilePostInfo';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { postComposeAddressRelationAtom } from 'states/PostComposeAtom';

const PostEditPage: React.FC = () => {
  const nativate = useNavigate();
  const param = useParams();
  const postId = param.post_id;
  const { data: profilePost, isError: isErrorByProfilePost } =
    QueryStatePostInfo(postId || '');

  const [postUploadList, setPostUploadList] = useState<PostUploadContent[]>([]);
  const [postTitle, setPostTitle] = useState<string>('');
  const [postBodyText, setPostBodyText] = useState<string>('');
  const [postTagList, setPostTagList] = useState<string[]>([]);

  const [targetAudienceId, setTargetAudienceId] = useState<number>(
    POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_ID,
  );

  const [postComposeAddressRelation, setPostComposeAddressRelation] =
    useRecoilState(postComposeAddressRelationAtom);

  const [isLoadingPopup, setIsLoadingPopup] = useState<boolean>(false);

  const onClickUploadButton = () => {
    const postContents = postUploadList.map((v, key) => {
      return {
        postContentType: v.contentType,
        content: v.contentUrl,
        ascSortNum: key,
      } as PostContentInterface;
    });

    const postComposeUploadByResourceLinkReq: PostComposeUploadByResourceLinkReq =
      {
        address: postComposeAddressRelation.roadAddr,
        postContents: postContents,
        tagList: postTagList,
        title: postTitle,
        bodyText: postBodyText,
      };
    setIsLoadingPopup(true);
    // createPostByResourceLink(postComposeUploadByResourceLinkReq).then(() => {
    //   setIsLoadingPopup(false);
    //   navigate(-1);
    // });
  };

  useEffect(() => {
    if (!profilePost) return;
    setPostTitle(profilePost.postTitle);
    setPostBodyText(profilePost.postBodyText);
    setPostTagList(profilePost.tags);
    setPostComposeAddressRelation({
      roadAddr: profilePost.location.address,
      buildName: '',
    });
    setPostUploadList(
      profilePost.postContents.map((v) => {
        return {
          contentUrl: v.content,
          contentType: v.postContentType,
          isLink: true,
          isUploadedLink: true,
          fileBlob: null,
          filename: null,
        };
      }),
    );
    setTargetAudienceId(profilePost.targetAudTypeId);
  }, [profilePost]);

  useEffect(() => {
    if (!isErrorByProfilePost) return;
    nativate(HOME_PATH);
  }, [isErrorByProfilePost]);
  return (
    <AppBaseTemplate>
      <PoseComposeHeader titleName={'게시물'} />
      <PoseComposeBody
        postTitle={postTitle}
        setPostTitle={setPostTitle}
        postBodyText={postBodyText}
        setPostBodyText={setPostBodyText}
        postTagList={postTagList}
        setPostTagList={setPostTagList}
        postUploadContentList={postUploadList}
        setPostUploadContentList={setPostUploadList}
        targetAudienceId={targetAudienceId}
        setTargetAudienceId={setTargetAudienceId}
        isLoadingPopup={isLoadingPopup}
        setIsLoadingPopup={setIsLoadingPopup}
        onClickActionFunc={onClickUploadButton}
        composeButtonTitle={'게시물 수정'}
      />
    </AppBaseTemplate>
  );
};

export default PostEditPage;
