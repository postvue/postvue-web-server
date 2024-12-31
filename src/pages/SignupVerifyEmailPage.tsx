import ErrorMsgPopup from 'components/popups/ErrorMsgPopup';
import LoadingPopup from 'components/popups/LoadingPopup';
import { EMAIL_SIGNUP_CODE_QUERY_PARAM } from 'const/login/EmailConst';
import { HOME_PATH, SIGNUP_PATH } from 'const/PathConst';
import { useGoBackOrNavigate } from 'global/util/historyStateUtil';
import React, { useEffect, useState } from 'react';
import { postAuthSignupVerifyEmail } from 'services/auth/postAuthSignupVerifyEmail';

const SignupVerifyEmailPage: React.FC = () => {
  const code = new URL(window.location.href).searchParams.get(
    EMAIL_SIGNUP_CODE_QUERY_PARAM,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const goBackOrNavigate = useGoBackOrNavigate(HOME_PATH);

  useEffect(() => {
    if (code !== null) {
      postAuthSignupVerifyEmail({
        verificationCode: code,
      })
        .then(() => {
          window.location.href = SIGNUP_PATH;
        })
        .catch(() => {
          setIsError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      goBackOrNavigate();
    }
  }, []);

  return (
    <div>
      {loading && <LoadingPopup />}
      {!loading && isError && (
        <ErrorMsgPopup
          errorMsgPopupTitle={'인증 에러'}
          errorMsgPopupSubTitle={
            '인증 실패로 가입 처리에 실패했습니다. \n 계속 오류 발생시, 고객센터로 문의주세요.'
          }
          onClose={() => {
            goBackOrNavigate();
          }}
        />
      )}
    </div>
  );
};

export default SignupVerifyEmailPage;
