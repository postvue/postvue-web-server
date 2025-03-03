import {
  SIGNUP_GENDER_FEMALE_CATEGORY,
  SIGNUP_GENDER_FEMALE_TITLE,
  SIGNUP_GENDER_MALE_CATEGORY,
  SIGNUP_GENDER_MALE_TITLE,
  SIGNUP_GENDER_OTHERS_CATEGORY,
  SIGNUP_GENDER_OTHERS_TITLE,
  SIGNUP_MIN_AGE,
} from 'const/SignupConst';
import { checkAgeDate, formatDate } from 'global/util/DateTimeUtil';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { signupInfoAtom } from 'states/SignupAtom';
import styled from 'styled-components';
import SignupHeader from '../SignupHeader';

import { ReactComponent as GenderCategoryCheckIcon } from 'assets/images/icon/svg/CategoryCheckIcon.svg';
import { ReactComponent as GenderCategoryNotCheckIcon } from 'assets/images/icon/svg/CategoryNotCheckIcon.svg';
import SignupNextButton from '../SignupNextButton';

const SignupBirthdateGenderStep: React.FC = () => {
  const [signupInfo, setSignupInfo] = useRecoilState(signupInfoAtom);

  const [birthdate, setBitrhDate] = useState<string>(signupInfo.birthdate);

  const [gender, setGender] = useState<string>(SIGNUP_GENDER_FEMALE_CATEGORY);
  const onChangeBitrhdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBitrhDate(e.target.value);
    setSignupInfo((prev) => ({ ...prev, birthdate: e.target.value }));
  };

  const genderCategoryList = [
    {
      titleName: SIGNUP_GENDER_FEMALE_TITLE,
      value: SIGNUP_GENDER_FEMALE_CATEGORY,
    },
    { titleName: SIGNUP_GENDER_MALE_TITLE, value: SIGNUP_GENDER_MALE_CATEGORY },
    {
      titleName: SIGNUP_GENDER_OTHERS_TITLE,
      value: SIGNUP_GENDER_OTHERS_CATEGORY,
    },
  ];

  useEffect(() => {
    setSignupInfo((prev) => ({ ...prev, gender: gender }));
  }, [gender]);

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

      <SignupStepTitleWrap>
        <SignupStepTitle>성별을 선택하세요.</SignupStepTitle>
        <SignupStepSubTitle>
          성별은 관련성이 높은 컨텐츠를 찾는데 도움이 됩니다.
          <br />
          성별은 프로필에도 표시되지 않습니다.
        </SignupStepSubTitle>
      </SignupStepTitleWrap>
      <SignupGenderContainer>
        {genderCategoryList.map((value, key) => (
          <SignupGenderItemWrap
            key={key}
            onClick={() => setGender(value.value)}
          >
            <SignupGenderTitle>{value.titleName}</SignupGenderTitle>
            <SignupGenderCheckWarp>
              {gender === value.value ? (
                <GenderCategoryCheckIcon />
              ) : (
                <GenderCategoryNotCheckIcon />
              )}
            </SignupGenderCheckWarp>
          </SignupGenderItemWrap>
        ))}
      </SignupGenderContainer>
      <SignupNextButton
        isActive={
          birthdate !== '' &&
          checkAgeDate(birthdate, SIGNUP_MIN_AGE) &&
          signupInfo.gender !== ''
        }
      />
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

const SignupGenderContainer = styled.div`
  margin: 0
    calc(
      20px + ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding}
    );
  display: flex;
  flex-flow: column;
  gap: 20px;
  flex: 1;
`;

const SignupGenderItemWrap = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const SignupGenderCheckWarp = styled.div``;

const SignupGenderTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  font-size: 18px;
`;

export default SignupBirthdateGenderStep;
