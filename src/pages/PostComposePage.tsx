import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PostComposePageBody from 'components/popups/postcompose/PostComposePageBody';
import { HOME_PATH } from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { useGoBackOrNavigate } from 'global/util/historyStateUtil';
import React, { useEffect } from 'react';

const PostComposePage: React.FC = () => {
  const goBackOrNavigate = useGoBackOrNavigate(HOME_PATH);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > MEDIA_MOBILE_MAX_WIDTH_NUM) {
        goBackOrNavigate();
      }
    };

    // 페이지 로드시 크기 확인
    handleResize();

    // 창 크기 변경시 크기 확인
    window.addEventListener('resize', handleResize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>
      <AppBaseTemplate>
        <PostComposePageBody actionFuncByCompose={() => goBackOrNavigate()} />
      </AppBaseTemplate>
      <MyAccountSettingInfoState />
    </>
  );
};

export default PostComposePage;
