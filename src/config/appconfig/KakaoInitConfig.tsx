import { KAKAO_SDK_KEY } from 'const/login/KakaoConst';
import React from 'react';
const KakaoInitConfig: React.FC = () => {
  // kakao sdk
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_SDK_KEY);
  }
  return <></>;
};

export default KakaoInitConfig;
