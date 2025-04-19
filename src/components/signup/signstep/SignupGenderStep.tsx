import {
  SIGNUP_GENDER_FEMALE_CATEGORY,
  SIGNUP_GENDER_FEMALE_TITLE,
  SIGNUP_GENDER_MALE_CATEGORY,
  SIGNUP_GENDER_MALE_TITLE,
  SIGNUP_GENDER_OTHERS_CATEGORY,
  SIGNUP_GENDER_OTHERS_TITLE,
} from 'const/SignupConst';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { signupInfoAtom } from 'states/SignupAtom';
import styled from 'styled-components';
import SignupHeader from '../SignupHeader';

import { ReactComponent as GenderCategoryCheckIcon } from 'assets/images/icon/svg/CategoryCheckIcon.svg';
import { ReactComponent as GenderCategoryNotCheckIcon } from 'assets/images/icon/svg/CategoryNotCheckIcon.svg';
import SignupNextButton from '../SignupNextButton';

const SignupGenderStep: React.FC = () => {
  const [signupInfo, setSignupInfo] = useRecoilState(signupInfoAtom);

  const [gender, setGender] = useState<string>(SIGNUP_GENDER_FEMALE_CATEGORY);

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

  return (
    <>
      <SignupHeader />

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
      <SignupNextButton isActive={signupInfo.gender !== ''} />
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

export default SignupGenderStep;
