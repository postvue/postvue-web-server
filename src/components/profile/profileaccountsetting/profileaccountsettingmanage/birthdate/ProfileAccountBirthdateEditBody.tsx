import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import BottomNextButton from 'components/common/buttton/BottomNextButton';
import { APP_SERVICE_NAME } from 'const/AppInfoConst';
import { INIT_EMPTY_STRING_VALUE } from 'const/AttributeConst';
import { SIGNUP_MIN_AGE } from 'const/SignupConst';
import { SETTING_EDIT_BUTTON_PHASE_TEXT } from 'const/SystemPhraseConst';
import { checkAgeDate, formatDate } from 'global/util/DateTimeUtil';
import { QueryMutationPutMyProfileBirthdateInfo } from 'hook/queryhook/QueryMutationPutMyProfileBirthdateInfo';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';

const ProfileAccountBirthdateEditBody: React.FC = () => {
  const { data, isFetched } = QueryStateMyProfileInfo();
  const [birthdate, setBitrhDate] = useState<string>('');

  const putProfileBirthdateInfoMutation =
    QueryMutationPutMyProfileBirthdateInfo();

  const onChangeBitrhdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBitrhDate(e.target.value);
  };

  const onClickEditBirthdate = () => {
    if (birthdate !== '' && checkAgeDate(birthdate, SIGNUP_MIN_AGE)) {
      putProfileBirthdateInfoMutation.mutate({
        birthdate: birthdate,
      });
    }
  };

  useEffect(() => {
    setBitrhDate(data?.birthdate || INIT_EMPTY_STRING_VALUE);
  }, [data]);

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
      {isFetched && (
        <ProfileEditEmailContainer>
          <ProfileEditEmailInputWrap>
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
          </ProfileEditEmailInputWrap>
          {birthdate !== '' && !checkAgeDate(birthdate, SIGNUP_MIN_AGE) && (
            <SignupMinAgeWrap>
              <SignupMinAgeCheck>
                만 {SIGNUP_MIN_AGE}세 이상 부터 가입할 수 있습니다.
              </SignupMinAgeCheck>
            </SignupMinAgeWrap>
          )}

          <ProfileBirthDetailInfo>
            {`계정을 사용하는 사람의 생년월일을 입력해 주세요.개인정보 처리방침에
          설명되어 있듯이, ${APP_SERVICE_NAME}는 만 ${SIGNUP_MIN_AGE} 세 이상 사용자만 사용 가능합니다.`}
          </ProfileBirthDetailInfo>

          <BottomNextButton
            title={SETTING_EDIT_BUTTON_PHASE_TEXT}
            notActiveTitle={SETTING_EDIT_BUTTON_PHASE_TEXT}
            isActive={
              birthdate !== '' && checkAgeDate(birthdate, SIGNUP_MIN_AGE)
            }
            actionFunc={onClickEditBirthdate}
          />
        </ProfileEditEmailContainer>
      )}
    </>
  );
};

const ProfileEditEmailContainer = styled.div`
  padding-top: 30px;
`;

const ProfileEditEmailInputWrap = styled.div`
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const SignupMinAgeWrap = styled.div`
  margin: 7px 0px 0px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const SignupMinAgeCheck = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.errorColor.Red};
`;

const ProfileBirthDetailInfo = styled.div`
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey7};
  margin-top: 10px;
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

export default ProfileAccountBirthdateEditBody;
