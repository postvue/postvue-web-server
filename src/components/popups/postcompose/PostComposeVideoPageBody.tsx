import PostComposeHeader from 'components/posecompose/PostComposeHeader';
import PostVideoComposeBody from 'components/posecompose/PostVideoComposeBody';
import {
  POST_COMPOSE_BUTTON_PHRASE,
  POST_VIDEO_COMPOSE_HEADER_TITLE_PHRASE,
} from 'const/PostComposeConst';
import {
  BRIDGE_EVENT_UPLOAD_VIDEO_TO_SERVER_TYPE,
  BridgeMsgInterface,
} from 'const/ReactNativeConst';
import { POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_ID } from 'const/TabConfigConst';
import { SnsPostComposeCreateReqInterface } from 'global/interface/post';
import { fetchProfileAccountListInfinite } from 'global/util/channel/static/fetchProfileAccountListInfinite';
import { fetchProfileScrapListInfinite } from 'global/util/channel/static/fetchProfileScrapListInfinite';
import { refetchProfileScrapInfo } from 'global/util/channel/static/refetchProfileScrapListInfo';
import {
  isApp,
  sendUploadPostInfoCreateEventToServer,
} from 'global/util/reactnative/nativeRouter';
import { useMessageListener } from 'hook/customhook/useMessageListener';
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

const PostComposeVideoPageBody: React.FC<PostComposePageBodyProps> = ({
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

  // useEffect(() => {
  //   if (!isLoadingPopup) return;
  //   const timeoutId = setTimeout(() => {
  //     if (!isApp()) return;
  //     if (isLoadingPopup) {
  //       setIsLoadingPopup(false);
  //       alert('오류로 인해 업로드에 실패했습니다.');
  //     }
  //   }, 10000);

  //   return () => {
  //     clearTimeout(timeoutId);
  //   };
  // }, [isLoadingPopup]);

  const onClickUploadButton = async () => {
    if (isApp()) {
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

      sendUploadPostInfoCreateEventToServer(snsPostComposeCreateReq);

      setIsLoadingPopup(true);
    } else {
      const formData = new FormData();
      const snsPostComposeCreateReq: SnsPostComposeCreateReqInterface = {
        address: postComposeAddressRelation.roadAddr,
        buildName: postComposeAddressRelation.buildName,
        latitude: postComposeAddressRelation.latitude,
        longitude: postComposeAddressRelation.longitude,
        tagList: postTagList,
        title: postTitle,
        bodyText: postBodyText,
        externalImgLinkList: [],
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

      const media = uploadResourceList[0];
      if (media.fileBlob === null)
        throw new Error('하나 이상 비디오를 보내야 됩니다.');

      if (media.isLink || media.fileBlob.type.startsWith('image/')) {
        throw new Error('지원하지 않는 미디어입니다.');
      }

      formData.append('files', media.fileBlob);

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
    }
  };

  const handleSuccessSendVideoTOServerMessage = (event: MessageEvent) => {
    try {
      const nativeEvent: BridgeMsgInterface = JSON.parse(event.data);

      if (nativeEvent.type === BRIDGE_EVENT_UPLOAD_VIDEO_TO_SERVER_TYPE) {
        fetchProfileScrapListInfinite();
        if (myProfileInfo) {
          fetchProfileAccountListInfinite(myProfileInfo.username);
        }
        refetchProfileScrapInfo();
        actionFuncByCompose();
      }
    } catch (error) {
      console.error('Failed to parse message:', event.data);
    } finally {
      setIsLoadingPopup(false);
    }
  };

  useMessageListener(handleSuccessSendVideoTOServerMessage);

  return (
    <PostComposePageBodyContainer>
      <PostComposeHeader
        titleName={POST_VIDEO_COMPOSE_HEADER_TITLE_PHRASE}
        hasPrevButton={hasPrevButton}
        actionFunc={onClose}
      />
      <PostVideoComposeBody
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

export default PostComposeVideoPageBody;
