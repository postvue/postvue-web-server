import { CredentialResponse } from '@react-oauth/google';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useEffect, useRef } from 'react';

interface GoogleOneTapProps {
  clientId: string;
  onLoginSuccess: (credentialResponse: CredentialResponse) => void;
}

const GoogleOneTap: React.FC<GoogleOneTapProps> = ({
  clientId,
  onLoginSuccess,
}) => {
  const { windowWidth } = useWindowSize();

  const googleLoginInitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  useEffect(() => {
    googleLoginInitTimerRef.current = setTimeout(() => {
      if (typeof window !== 'undefined' && window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            onLoginSuccess(response.credential);
          },
          auto_select: false,
          cancel_on_tap_outside: false, // 사용자가 창을 클릭하면 닫히지 않음
        });

        if (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM) {
          window.google.accounts.id.prompt(); // One Tap 로그인 창 표시
        }
      }
    }, 500);

    return () => {
      if (googleLoginInitTimerRef.current) {
        clearTimeout(googleLoginInitTimerRef.current);
      }
    };
  }, []);

  return null; // UI 요소가 필요하지 않음
};

export default GoogleOneTap;
