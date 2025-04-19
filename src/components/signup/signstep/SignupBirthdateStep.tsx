import { SIGNUP_MIN_AGE } from 'const/SignupConst';
import { checkAgeDate, formatDate } from 'global/util/DateTimeUtil';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { signupInfoAtom } from 'states/SignupAtom';
import styled from 'styled-components';
import SignupHeader from '../SignupHeader';

import SignupNextButton from '../SignupNextButton';

const SignupBirthdateStep: React.FC = () => {
  const [signupInfo, setSignupInfo] = useRecoilState(signupInfoAtom);

  const [birthdate, setBitrhDate] = useState<string>(signupInfo.birthdate);

  const onChangeBitrhdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBitrhDate(e.target.value);
    setSignupInfo((prev) => ({ ...prev, birthdate: e.target.value }));
  };

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    const mobileDevices =
      /(iphone|ipod|ipad|android|blackberry|windows phone|opera mini|iemobile|mobile)/i;
    setIsMobile(mobileDevices.test(userAgent)); // 모바일 여부 설정
  }, []);

  const dateInputRef = useRef<HTMLInputElement>(null);
  const handleLabelClick = () => {
    dateInputRef.current?.focus();
    dateInputRef.current?.click();
  };

  return (
    <>
      <SignupHeader />
      <SignupStepTitleWrap>
        <SignupStepTitle>생년월일을 입력해주세요.</SignupStepTitle>
        <SignupStepSubTitle>
          생년월일은 보다 맞춤화된 추천에 도움이 됩니다. <br />
          생년월일은 프로필에 표시되지 않습니다.
        </SignupStepSubTitle>
      </SignupStepTitleWrap>
      <SignupBirthContainer>
        <SignupDateWrap>
          {isMobile ? (
            <>
              <SignupDateInputByMobile
                type={'date'}
                value={birthdate}
                onChange={(e) => onChangeBitrhdate(e)}
                ref={dateInputRef}
              />
              <SignupDateInputMobileLabel onClick={handleLabelClick}>
                {birthdate ? formatDate(birthdate) : '날짜를 입력해주세요.'}
              </SignupDateInputMobileLabel>
            </>
          ) : (
            <SignupDateInput
              type={'date'}
              value={birthdate}
              onChange={(e) => onChangeBitrhdate(e)}
              ref={dateInputRef}
            />
          )}
        </SignupDateWrap>
        {birthdate !== '' && !checkAgeDate(birthdate, SIGNUP_MIN_AGE) && (
          <SignupMinAgeWrap>
            <SignupMinAgeCheck>
              만 {SIGNUP_MIN_AGE}세 이상 부터 가입할 수 있습니다.
            </SignupMinAgeCheck>
          </SignupMinAgeWrap>
        )}
      </SignupBirthContainer>

      <SignupNextButton
        isActive={birthdate !== '' && checkAgeDate(birthdate, SIGNUP_MIN_AGE)}
      />
    </>
  );
};

const SignupStepTitleWrap = styled.div`
  padding: 30px 0px 20px 0px;
`;

const SignupStepTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline3};
  text-align: center;
  margin-bottom: 10px;
`;

const SignupStepSubTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  text-align: center;
`;

const SignupDateWrap = styled.div`
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const SignupDateInput = styled.input`
  padding: 15px 16px;
  background-color: ${({ theme }) => theme.grey.Grey1};
  border: 0px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  border-radius: 20px;
  color: black;
  font: ${({ theme }) => theme.fontSizes.Body2};
`;

const SignupDateInputByMobile = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
`;

const SignupBirthContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: 20px;
  flex: 1;
`;

const SignupDateInputMobileLabel = styled.label`
  padding: 15px 16px;
  background-color: ${({ theme }) => theme.grey.Grey1};
  border: 0px;
  width: 100%;

  display: block;
  box-sizing: border-box;
  outline: none;
  border-radius: 20px;
  color: ${({ theme }) => theme.grey.Grey7};
  font: ${({ theme }) => theme.fontSizes.Body3};

  cursor: pointer;
`;

const SignupMinAgeWrap = styled.div`
  margin: 7px 0px 0px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const SignupMinAgeCheck = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.errorColor.Red};
`;

export default SignupBirthdateStep;
