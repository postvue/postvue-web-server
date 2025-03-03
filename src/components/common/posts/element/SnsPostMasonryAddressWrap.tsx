import { PROFILE_POST_LIST_PATH } from 'const/PathConst';
import { POST_RELATION_SEARCH_TYPE } from 'const/PostConst';
import {
  POST_DETAIL_POPUP_PARAM,
  POST_DETAIL_POST_ID_PARAM,
  POST_DETAIL_PROFILE_PARAM,
  TRUE_PARAM,
} from 'const/QueryParamConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { LinkPopupInfoType, PostRsp } from 'global/interface/post';
import React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { SEARCH_TYPE_PARAM } from 'services/appApiQueryParam';
import { postRspAtom } from 'states/PostAtom';
import styled from 'styled-components';

interface SnsPostMasonryAddressWrapProps {
  isActiveNavToPost: boolean;
  postRsp: PostRsp;
  linkPopupInfo: LinkPopupInfoType;
  actionFunc?: () => void;
  children: React.ReactNode;
  searchType?: POST_RELATION_SEARCH_TYPE;
}

const SnsPostMasonryAddressWrap: React.FC<SnsPostMasonryAddressWrapProps> = ({
  isActiveNavToPost,
  postRsp,
  linkPopupInfo,
  actionFunc,
  children,
  searchType,
}) => {
  const navigate = useNavigate();
  const setSnsPost = useSetRecoilState(postRspAtom);
  return (
    <PostImgAddressWrap
      onClick={() => {
        if (!isActiveNavToPost) return;

        setSnsPost(postRsp);
        if (
          window.innerWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ||
          linkPopupInfo.isLinkPopup
        ) {
          // 모바일 크기
          // url만 바뀌도록 변경

          const searchParams = new URLSearchParams(location.search);

          // 새로운 쿼리 파라미터 추가 또는 기존 파라미터 값 수정
          searchParams.set(POST_DETAIL_POPUP_PARAM, TRUE_PARAM);
          searchParams.set(POST_DETAIL_POST_ID_PARAM, postRsp.postId);
          searchParams.set(POST_DETAIL_PROFILE_PARAM, postRsp.username);

          // 새로운 쿼리 파라미터가 포함된 URL 생성
          const newSearch = searchParams.toString();
          const newPath =
            `${location.pathname}?${newSearch}` +
            (searchType ? `&${SEARCH_TYPE_PARAM}=${searchType}` : '');

          navigate(newPath, {
            replace: linkPopupInfo.isReplaced,
            state: { isDetailPopup: true },
          });
          // setIsPostDetailInfoPopup(true);
          // setPostDetailInfo({
          //   postId: v.postId,
          //   userId: v.username,
          // });
        } else {
          // 데스크탑 크기
          // url로 이동

          navigate(
            generatePath(PROFILE_POST_LIST_PATH, {
              user_id: postRsp.username,
              post_id: postRsp.postId,
            }),
            {
              state: { isDetailPopup: true },
            },
          );
        }
        if (actionFunc) {
          actionFunc();
        }
      }}
    >
      {children}
    </PostImgAddressWrap>
  );
};

const PostImgAddressWrap = styled.div`
  position: relative;
  cursor: pointer;
  height: 100%;
`;

export default SnsPostMasonryAddressWrap;
