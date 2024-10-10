import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import BottomNextButton from 'components/common/buttton/BottomNextButton';
import ToastPopup from 'components/popups/ToastMsgPopup';
import { INIT_EMPTY_STRING_VALUE } from 'const/AttributeConst';
import { SIGNUP_MIN_AGE } from 'const/SignupConst';
import { SETTING_EDIT_BUTTON_PHASE_TEXT } from 'const/SystemPhraseConst';
import { checkAgeDate } from 'global/util/DateTimeUtil';
import { QueryMutationPutMyProfileBirthdateInfo } from 'hook/queryhook/QueryMutationPutMyProfileBirthdateInfo';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import theme from 'styles/theme';

const ProfileAccountBirthdateEditBody: React.FC = () => {
  const { data } = QueryStateMyProfileInfo();
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

  return (
    <>
      <ProfileEditEmailContainer>
        <ProfileEditEmailInputWrap>
          <SignupDateInput
            type={'date'}
            value={birthdate}
            onChange={(e) => onChangeBitrhdate(e)}
          />
        </ProfileEditEmailInputWrap>
        {birthdate !== '' && !checkAgeDate(birthdate, SIGNUP_MIN_AGE) && (
          <SignupMinAgeWrap>
            <SignupMinAgeCheck>
              만 {SIGNUP_MIN_AGE}세 이상 부터 가입할 수 있습니다.
            </SignupMinAgeCheck>
          </SignupMinAgeWrap>
        )}

        <BottomNextButton
          title={SETTING_EDIT_BUTTON_PHASE_TEXT}
          notActiveTitle={SETTING_EDIT_BUTTON_PHASE_TEXT}
          isActive={birthdate !== '' && checkAgeDate(birthdate, SIGNUP_MIN_AGE)}
          actionFunc={onClickEditBirthdate}
        />
      </ProfileEditEmailContainer>
      <ToastPopup backgroundColor={theme.mainColor.Black} />
    </>
  );
};

const ProfileEditEmailContainer = styled.div`
  padding-top: calc(${({ theme }) => theme.systemSize.header.height} + 30px);
`;

const ProfileEditEmailInputWrap = styled.div`
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const SignupDateInput = styled.input`
  padding: 15px 16px;
  background-color: ${({ theme }) => theme.mainColor.White};
  border: 1px solid ${({ theme }) => theme.grey.Grey2};
  width: 100%;
  box-sizing: border-box;
  outline: none;
  border-radius: 30px;
  font: ${({ theme }) => theme.fontSizes.Body2};
`;

const SignupMinAgeWrap = styled.div`
  margin: 7px 0px 0px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const SignupMinAgeCheck = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.errorColor.Red};
`;

export default ProfileAccountBirthdateEditBody;
