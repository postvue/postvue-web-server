import { KAKAO_SDK_KEY } from 'const/login/KakaoConst';
import React, { useEffect } from 'react';
const KakaoInitConfig: React.FC = () => {
  // kakao sdk
  useEffect(() => {
    // 카카오 SDK 초기화
    if (!window.Kakao) {
      const script = document.createElement('script');
      script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
      script.async = true;

      script.onload = () => {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(KAKAO_SDK_KEY);
        }
      };
      document.body.appendChild(script);
    } else {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_SDK_KEY);
      }
    }
  }, []);
  return <></>;
};

export default KakaoInitConfig;
