import {
  POST_DETAIL_POPUP_PARAM,
  POST_DETAIL_POST_ID_PARAM,
  POST_DETAIL_PROFILE_PARAM,
  TRUE_PARAM,
} from 'const/QueryParamConst';
import { sendPopupEvent } from 'global/util/reactnative/StackRouter';
import { isValidString } from 'global/util/ValidUtil';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import {
  isPostDetailInfoPopupAtom,
  postDetailInfoPopupAtom,
} from 'states/PostAtom';

interface TestWrapperProps {
  children: React.ReactNode;
}

const TestWrapper: React.FC<TestWrapperProps> = ({ children }) => {
  const navigate = useNavigate();

  const [isPostDetailInfoPopup, setIsPostDetailInfoPopup] = useRecoilState(
    isPostDetailInfoPopupAtom,
  );
  const [postDetailInfo, setPostDetailInfo] = useRecoilState(
    postDetailInfoPopupAtom,
  );

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
  }, [location.href]);
  return <div>{children}</div>;
};

export default TestWrapper;
