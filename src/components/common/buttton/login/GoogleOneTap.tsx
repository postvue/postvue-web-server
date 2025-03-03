import { CredentialResponse } from '@react-oauth/google';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useEffect } from 'react';

interface GoogleOneTapProps {
  clientId: string;
  onLoginSuccess: (credentialResponse: CredentialResponse) => void;
}

const GoogleOneTap: React.FC<GoogleOneTapProps> = ({
  clientId,
  onLoginSuccess,
}) => {
  const { windowWidth } = useWindowSize();
  useEffect(() => {
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            onLoginSuccess(response.credential);
          },
          auto_select: true, // 자동 로그인 (사용자가 이전에 승인한 경우)
          cancel_on_tap_outside: false, // 사용자가 창을 클릭하면 닫히지 않음
        });

        if (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM) {
          window.google.accounts.id.prompt(); // One Tap 로그인 창 표시
        }
      }
    }, 500);
  }, []);

  return null; // UI 요소가 필요하지 않음
};

export default GoogleOneTap;
