import { PROFILE_POST_LIST_PATH } from 'const/PathConst';
import {
  POST_DETAIL_POPUP_PARAM,
  POST_DETAIL_POST_ID_PARAM,
  POST_DETAIL_PROFILE_PARAM,
  PREV_URL_PARAM,
  TRUE_PARAM,
} from 'const/QueryParamConst';
import { RoutePushEventDateInterface } from 'const/ReactNativeConst';
import { generatePath, NavigateFunction } from 'react-router-dom';
import { SEARCH_TYPE_PARAM } from 'services/appApiQueryParam';
import { stackRouterPush } from './reactnative/nativeRouter';

interface OnFuncRoutePostDetailType {
  navigate: NavigateFunction;
  postId: string;
  username: string;
  isStackRoute?: boolean;
  linkPopupInfo?: {
    isLinkPopup: boolean;
    isReplaced: boolean;
  };
  searchType?: string;
  navTimer?: number;
  prevUrl?: string;
}

export const onFuncRoutePostDetail = ({
  navigate,
  postId,
  username,
  isStackRoute = true,
  linkPopupInfo,
  searchType,
  navTimer,
  prevUrl,
}: OnFuncRoutePostDetailType): void => {
  if (linkPopupInfo && linkPopupInfo.isLinkPopup) {
    const onFunc = () => {
      // 모바일 크기
      // url만 바뀌도록 변경

      const searchParams = new URLSearchParams(location.search);

      // 새로운 쿼리 파라미터 추가 또는 기존 파라미터 값 수정
      searchParams.set(POST_DETAIL_POPUP_PARAM, TRUE_PARAM);
      searchParams.set(POST_DETAIL_POST_ID_PARAM, postId);
      searchParams.set(POST_DETAIL_PROFILE_PARAM, username);

      // 새로운 쿼리 파라미터가 포함된 URL 생성
      const newSearch = searchParams.toString();
      const newPath =
        `${location.pathname}?${newSearch}` +
        (searchType ? `&${SEARCH_TYPE_PARAM}=${searchType}` : '');

      navigate(newPath, {
        replace: linkPopupInfo.isReplaced,
        state: { isDetailPopup: true },
      });
    };

    if (navTimer) {
      setTimeout(() => {
        onFunc();
      }, navTimer);
    } else {
      onFunc();
    }
  } else {
    const data: RoutePushEventDateInterface = {
      isShowInitBottomNavBar: true,
    };
    const pathUrl =
      generatePath(PROFILE_POST_LIST_PATH, {
        user_id: username,
        post_id: postId,
      }) + (prevUrl ? `?${PREV_URL_PARAM}=${prevUrl}` : '');

    if (isStackRoute) {
      stackRouterPush(navigate, pathUrl, data);
    } else {
      navigate(pathUrl);
    }
  }
};
