import { ReactComponent as SignupTermOfServiceCheckIcon } from 'assets/images/icon/svg/signup/SignupCheckIcon.svg';
import { ReactComponent as SignupTermOfServiceNotCheckIcon } from 'assets/images/icon/svg/signup/SignupNotCheckIcon.svg';
import LoadingComponent from 'components/common/container/LoadingComponent';
import { ACCESS_TOKEN } from 'const/LocalStorageConst';
import { HOME_PATH } from 'const/PathConst';
import { SIGNUP_MIN_AGE } from 'const/SignupConst';
import {
  ACCOUNT_SETTING_PRIVACY_POLICY_URL,
  ACCOUNT_SETTING_TERMS_OF_SERVICE_URL,
  ACCOUNT_SETTING_TERMS_OF_USER_GEOLOATION_URL,
} from 'const/TabConfigConst';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { postAuthSignup } from 'services/auth/postAuthSignup';
import { signupInfoAtom } from 'states/SignupAtom';
import styled from 'styled-components';
import SignupCompleteButton from '../SignupCompleteButton';
import SignupHeader from '../SignupHeader';

const SignupTermOfServiceStep: React.FC = () => {
  const [signupInfo, setSignupInfo] = useRecoilState(signupInfoAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClickSignup = () => {
    postAuthSignup(signupInfo).then((value) => {
      localStorage.setItem(ACCESS_TOKEN, value);
      window.location.href = HOME_PATH;
    });
  };

  const [isFullAgreement, setIsFullAgreement] = useState<boolean>(false);

  const onClickFullAgreement = () => {
    if (isFullAgreement) {
      setSignupInfo((prev) => ({
        ...prev,
        termOfService: {
          agreeToAgeTerm: false,
          agreeToServieTerm: false,
          agreeToPrivacyPolicy: false,
          agreeToPrivacyPolicyToThirdPaties: false,
          agreeToMarketingCommunications: false,
          agreeToTermsOfUserGeoLocation: false,
        },
      }));
    } else {
      setSignupInfo((prev) => ({
        ...prev,
        termOfService: {
          agreeToAgeTerm: true,
          agreeToServieTerm: true,
          agreeToPrivacyPolicy: true,
          agreeToPrivacyPolicyToThirdPaties: true,
          agreeToMarketingCommunications: true,
          agreeToTermsOfUserGeoLocation: true,
        },
      }));
    }
    setIsFullAgreement(!isFullAgreement);
  };

  return (
    <>
      <SignupHeader />
      <SignupStepTitleWrap>
        <SignupStepTitle>
          시작하기 전에,
          <br />
          서비스 이용 약관을 확인해주세요.
        </SignupStepTitle>
      </SignupStepTitleWrap>

      <SingupTermOsServiceContainer>
        <SingupTermOsServiceCheckWrap onClick={onClickFullAgreement}>
          <SingupTermOsServiceCheckIconWrap>
            {isFullAgreement ? (
              <SignupTermOfServiceCheckIcon />
            ) : (
              <SignupTermOfServiceNotCheckIcon />
            )}
          </SingupTermOsServiceCheckIconWrap>
          <SingupTermOsServiceChecTiele>전체 동의</SingupTermOsServiceChecTiele>
        </SingupTermOsServiceCheckWrap>
        <SingupTermOsServiceCheckWrap
          onClick={() => {
            setSignupInfo((prev) => ({
              ...prev,
              termOfService: {
                ...signupInfo.termOfService,
                agreeToAgeTerm: !signupInfo.termOfService.agreeToAgeTerm,
              },
            }));
          }}
        >
          <SingupTermOsServiceCheckIconWrap>
            {signupInfo.termOfService.agreeToAgeTerm ? (
              <SignupTermOfServiceCheckIcon />
            ) : (
              <SignupTermOfServiceNotCheckIcon />
            )}
          </SingupTermOsServiceCheckIconWrap>
          <SingupTermOsServiceChecTiele>
            (필수) 만 {SIGNUP_MIN_AGE}세 이상입니다.*
          </SingupTermOsServiceChecTiele>
        </SingupTermOsServiceCheckWrap>

        <SingupTermOsServiceCheckWrap
          onClick={() => {
            setSignupInfo((prev) => ({
              ...prev,
              termOfService: {
                ...signupInfo.termOfService,
                agreeToPrivacyPolicy:
                  !signupInfo.termOfService.agreeToPrivacyPolicy,
              },
            }));
          }}
        >
          <SingupTermOsServiceCheckIconWrap>
            {signupInfo.termOfService.agreeToPrivacyPolicy ? (
              <SignupTermOfServiceCheckIcon />
            ) : (
              <SignupTermOfServiceNotCheckIcon />
            )}
          </SingupTermOsServiceCheckIconWrap>
          <SingupTermOsServiceChecTiele>
            (필수) 개인정보 수집 및 이용에 동의합니다.
          </SingupTermOsServiceChecTiele>
        </SingupTermOsServiceCheckWrap>
        <SingupTermOsServiceCheckWrap
          onClick={() => {
            setSignupInfo((prev) => ({
              ...prev,
              termOfService: {
                ...signupInfo.termOfService,
                agreeToServieTerm: !signupInfo.termOfService.agreeToServieTerm,
              },
            }));
          }}
        >
          <SingupTermOsServiceCheckIconWrap>
            {signupInfo.termOfService.agreeToServieTerm ? (
              <SignupTermOfServiceCheckIcon />
            ) : (
              <SignupTermOfServiceNotCheckIcon />
            )}
          </SingupTermOsServiceCheckIconWrap>
          <SingupTermOsServiceChecTiele
            style={{ textDecoration: 'underline' }}
            onClick={() => {
              window.open(
                ACCOUNT_SETTING_TERMS_OF_SERVICE_URL,
                '_blank',
                'noopener,noreferrer',
              );
            }}
          >
            (필수) 이용 약관에 동의합니다.*
          </SingupTermOsServiceChecTiele>
        </SingupTermOsServiceCheckWrap>
        <SingupTermOsServiceCheckWrap
          onClick={() => {
            setSignupInfo((prev) => ({
              ...prev,
              termOfService: {
                ...signupInfo.termOfService,
                agreeToPrivacyPolicyToThirdPaties:
                  !signupInfo.termOfService.agreeToPrivacyPolicyToThirdPaties,
              },
            }));
          }}
        >
          <SingupTermOsServiceCheckIconWrap>
            {signupInfo.termOfService.agreeToPrivacyPolicyToThirdPaties ? (
              <SignupTermOfServiceCheckIcon />
            ) : (
              <SignupTermOfServiceNotCheckIcon />
            )}
          </SingupTermOsServiceCheckIconWrap>
          <SingupTermOsServiceChecTiele
            style={{ textDecoration: 'underline' }}
            onClick={() => {
              window.open(
                ACCOUNT_SETTING_PRIVACY_POLICY_URL,
                '_blank',
                'noopener,noreferrer',
              );
            }}
          >
            (필수) 개인정보의 제 3자 제공에 동의합니다.
          </SingupTermOsServiceChecTiele>
        </SingupTermOsServiceCheckWrap>
        <SingupTermOsServiceCheckWrap
          onClick={() => {
            setSignupInfo((prev) => ({
              ...prev,
              termOfService: {
                ...signupInfo.termOfService,
                agreeToTermsOfUserGeoLocation:
                  !signupInfo.termOfService.agreeToTermsOfUserGeoLocation,
              },
            }));
          }}
        >
          <SingupTermOsServiceCheckIconWrap>
            {signupInfo.termOfService.agreeToTermsOfUserGeoLocation ? (
              <SignupTermOfServiceCheckIcon />
            ) : (
              <SignupTermOfServiceNotCheckIcon />
            )}
          </SingupTermOsServiceCheckIconWrap>
          <SingupTermOsServiceChecTiele
            style={{ textDecoration: 'underline' }}
            onClick={() => {
              window.open(
                ACCOUNT_SETTING_TERMS_OF_USER_GEOLOATION_URL,
                '_blank',
                'noopener,noreferrer',
              );
            }}
          >
            (필수) 위치정보 이용약관에 동의합니다.
          </SingupTermOsServiceChecTiele>
        </SingupTermOsServiceCheckWrap>
        {/* <SingupTermOsServiceCheckWrap
          onClick={() => {
            setSignupInfo((prev) => ({
              ...prev,
              termOfService: {
                ...signupInfo.termOfService,
                agreeToMarketingCommunications:
                  !signupInfo.termOfService.agreeToMarketingCommunications,
              },
            }));
          }}
        >
          <SingupTermOsServiceCheckIconWrap>
            {signupInfo.termOfService.agreeToMarketingCommunications ? (
              <SignupTermOfServiceCheckIcon />
            ) : (
              <SignupTermOfServiceNotCheckIcon />
            )}
          </SingupTermOsServiceCheckIconWrap>
          <SingupTermOsServiceChecTiele>
            (선택) 마케팅 정보 수신에 동의합니다.
          </SingupTermOsServiceChecTiele>
        </SingupTermOsServiceCheckWrap> */}
      </SingupTermOsServiceContainer>

      <SignupCompleteButton
        isActive={
          signupInfo.termOfService.agreeToAgeTerm &&
          signupInfo.termOfService.agreeToServieTerm &&
          signupInfo.termOfService.agreeToPrivacyPolicy &&
          signupInfo.termOfService.agreeToPrivacyPolicyToThirdPaties &&
          signupInfo.termOfService.agreeToTermsOfUserGeoLocation
        }
        actionFunc={() => {
          onClickSignup();
        }}
      />
      {isLoading && <LoadingComponent LoadingComponentStyle={{ top: '0px' }} />}
    </>
  );
};

const SignupStepTitleWrap = styled.div`
  padding: 30px 0px 50px 0px;
`;

const SignupStepTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline3};
  text-align: center;
  margin-bottom: 10px;
`;

const SingupTermOsServiceContainer = styled.div`
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  display: flex;
  flex-flow: column;
  gap: 16px;
  flex: 1;
`;

const SingupTermOsServiceCheckWrap = styled.div`
  display: flex;
  gap: 11px;
`;

const SingupTermOsServiceCheckIconWrap = styled.div`
  cursor: pointer;
`;

const SingupTermOsServiceChecTiele = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  width: 100%;
`;

export default SignupTermOfServiceStep;
