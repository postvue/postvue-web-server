import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import BottomNextButton from 'components/common/buttton/BottomNextButton';
import { INIT_EMPTY_STRING_VALUE } from 'const/AttributeConst';
import {
  SIGNUP_GENDER_FEMALE_CATEGORY,
  SIGNUP_GENDER_FEMALE_TITLE,
  SIGNUP_GENDER_MALE_CATEGORY,
  SIGNUP_GENDER_MALE_TITLE,
  SIGNUP_GENDER_OTHERS_CATEGORY,
  SIGNUP_GENDER_OTHERS_TITLE,
} from 'const/SignupConst';
import { SETTING_EDIT_BUTTON_PHASE_TEXT } from 'const/SystemPhraseConst';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';

import { ReactComponent as GenderCategoryCheckIcon } from 'assets/images/icon/svg/CategoryCheckIcon.svg';
import { ReactComponent as GenderCategoryNotCheckIcon } from 'assets/images/icon/svg/CategoryNotCheckIcon.svg';
import { QueryMutationPutMyProfileGenderInfo } from 'hook/queryhook/QueryMutationPutMyProfileGenderInfo';

const ProfileAccountGenderEditBody: React.FC = () => {
  const { data } = QueryStateMyProfileInfo();
  const [gender, setGender] = useState<string>(SIGNUP_GENDER_FEMALE_CATEGORY);

  const [loading, setLoading] = useState<boolean>(true);

  const putProfileGenderInfoMutation = QueryMutationPutMyProfileGenderInfo();

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

  const onClickEditGender = () => {
    if (genderCategoryList.map((value) => value.value).includes(gender)) {
      putProfileGenderInfoMutation.mutate({
        gender: gender,
      });
    }
  };

  useEffect(() => {
    setGender(data?.gender || INIT_EMPTY_STRING_VALUE);
    setLoading(false);
  }, [data]);

  return (
    <>
      {!loading && (
        <ProfileEditEmailContainer>
          <ProfileGenderEditContainer>
            {genderCategoryList.map((value, key) => (
              <ProfileGenderEditItemWrap
                key={key}
                onClick={() => setGender(value.value)}
              >
                <ProfileGenderEditTitle>
                  {value.titleName}
                </ProfileGenderEditTitle>
                <ProfileGenderEditCheckWarp>
                  {gender === value.value ? (
                    <GenderCategoryCheckIcon />
                  ) : (
                    <GenderCategoryNotCheckIcon />
                  )}
                </ProfileGenderEditCheckWarp>
              </ProfileGenderEditItemWrap>
            ))}
          </ProfileGenderEditContainer>

          <BottomNextButton
            title={SETTING_EDIT_BUTTON_PHASE_TEXT}
            notActiveTitle={SETTING_EDIT_BUTTON_PHASE_TEXT}
            isActive={(data?.gender || '') !== gender}
            actionFunc={onClickEditGender}
          />
        </ProfileEditEmailContainer>
      )}
    </>
  );
};

const ProfileEditEmailContainer = styled.div`
  padding-top: 30px;
`;

const ProfileGenderEditContainer = styled.div`
  margin: 0
    calc(${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding});
  display: flex;
  flex-flow: column;
  gap: 20px;
`;

const ProfileGenderEditItemWrap = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const ProfileGenderEditCheckWarp = styled.div`
  cursor: pointer;
  display: flex;
  margin: auto 0px;
`;

const ProfileGenderEditTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  font-size: 18px;
`;

export default ProfileAccountGenderEditBody;
