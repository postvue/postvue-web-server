import {
  isPostRelationSearchType,
  POST_RELATION_SEARCH_TYPE,
} from 'const/PostConst';
import {
  POST_DETAIL_POPUP_PARAM,
  POST_DETAIL_POST_ID_PARAM,
  POST_DETAIL_PROFILE_PARAM,
  TRUE_PARAM,
} from 'const/QueryParamConst';
import { sendPopupEvent } from 'global/util/reactnative/nativeRouter';
import { isValidString } from 'global/util/ValidUtil';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { SEARCH_TYPE_PARAM } from 'services/appApiQueryParam';
import {
  isPostDetailInfoPopupAtom,
  postDetailInfoPopupAtom,
} from 'states/PostAtom';

interface AppPopupWrapperProps {
  children: React.ReactNode;
}

const AppPopupWrapper: React.FC<AppPopupWrapperProps> = ({ children }) => {
  const location = useLocation();

  const setIsPostDetailInfoPopup = useSetRecoilState(isPostDetailInfoPopupAtom);
  const setPostDetailInfo = useSetRecoilState(postDetailInfoPopupAtom);

  // URL 쿼리 매개변수 읽기

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    const mobileDevices =
      /(iphone|ipod|ipad|android|blackberry|windows phone|opera mini|iemobile|mobile)/i;

    const url = new URL(window.location.href); // location.href를 기반으로 URL 객체 생성
    const params = url.searchParams; // searchParams 객체 가져오기
    const isPopup = params.get(POST_DETAIL_POPUP_PARAM) === TRUE_PARAM;
    const postId = params.get(POST_DETAIL_POST_ID_PARAM);
    const profile = params.get(POST_DETAIL_PROFILE_PARAM);
    const searchType_ = params.get(SEARCH_TYPE_PARAM);
    const searchType: POST_RELATION_SEARCH_TYPE | undefined =
      isPostRelationSearchType(searchType_ || '')
        ? (searchType_ as POST_RELATION_SEARCH_TYPE)
        : undefined;

    if (
      isPopup &&
      postId !== null &&
      isValidString(postId) &&
      profile !== null &&
      isValidString(profile)
    ) {
      setPostDetailInfo({
        postId: postId,
        userId: profile,
        searchType: searchType,
      });

      setIsPostDetailInfoPopup(true);

      sendPopupEvent(true);
    } else {
      setPostDetailInfo({
        postId: '',
        userId: '',
      });
      setIsPostDetailInfoPopup(false);

      sendPopupEvent(false);
    }
  }, [location]);
  return <div>{children}</div>;
};

export default AppPopupWrapper;
