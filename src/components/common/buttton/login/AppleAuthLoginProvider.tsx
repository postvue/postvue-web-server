import React, { useEffect } from 'react';

const appleLoginSrc =
  'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';

const AppleAuthLoginProvider: React.FC = () => {
  useEffect(() => {
    let script = document.querySelector(
      `script[src="${appleLoginSrc}"]`,
    ) as HTMLScriptElement | null;

    if (!script) {
      // Apple SDK 로드
      console.log('초기화');
      script = document.createElement('script');
      script.src = appleLoginSrc;
      script.type = 'text/javascript';
      script.charset = 'utf-8';
      script.async = true;
      document.body.appendChild(script);
    }

    script.onload = () => {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: 'com.feelog.social', // Apple Developer에서 등록한 서비스 ID
          scope: 'email name',
          redirectURI: 'https://0284-218-155-114-215.ngrok-free.app/login',
          state: 'random_state_string',
          usePopup: true, // 팝업 방식으로 로그인 실행
        });
      }
    };
  }, []);

  return <></>;
};

export default AppleAuthLoginProvider;
