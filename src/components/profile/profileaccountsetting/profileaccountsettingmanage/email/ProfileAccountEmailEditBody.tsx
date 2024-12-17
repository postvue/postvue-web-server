import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import BottomNextButton from 'components/common/buttton/BottomNextButton';
import { APP_SERVICE_NAME } from 'const/AppInfoConst';
import { INIT_EMPTY_STRING_VALUE } from 'const/AttributeConst';
import { SETTING_EDIT_BUTTON_PHASE_TEXT } from 'const/SystemPhraseConst';
import { ACCOUNT_SETTING_EMAIL_EDIT_TAB_NAME } from 'const/TabConfigConst';
import { getSearchQueryByDebounce } from 'global/util/SearchUtil';
import { isValidEmail, isValidString } from 'global/util/ValidUtil';
import { QueryMutationPutMyProfileEmailInfo } from 'hook/queryhook/QueryMutationPutMyProfileEmailInfo';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import { PutMyProfileEmailInfoReq } from 'services/profile/putMyProfileEmailInfo';

const ProfileAccountEmailEditBody: React.FC = () => {
  const { data } = QueryStateMyProfileInfo();
  const [email, setEmail] = useState<string>(INIT_EMPTY_STRING_VALUE);

  const putProfileEmailInfoMutation = QueryMutationPutMyProfileEmailInfo();
  const [loading, setLoading] = useState<boolean>(true);

  const debounceSetEmail = getSearchQueryByDebounce(
    () => {
      setLoading(false);
    },
    [],
    300,
  );

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setEmail(e.target.value);
    debounceSetEmail(e.target.value);
  };

  const onClickEditEmail = () => {
    if (isValidEmail(email) && isValidString(email)) {
      putProfileEmailInfoMutation.mutate({
        email: email,
      } as PutMyProfileEmailInfoReq);
    }
  };

  useEffect(() => {
    setEmail(data?.email || INIT_EMPTY_STRING_VALUE);
  }, [data]);

  return (
    <>
      <ProfileEditEmailContainer>
        <ProfileEditEmailInputWrap>
          <ProfileEditEmailInput
            value={email}
            onChange={(e) => onChangeEmail(e)}
            placeholder={ACCOUNT_SETTING_EMAIL_EDIT_TAB_NAME}
          />
        </ProfileEditEmailInputWrap>
        {!loading && email !== '' && !isValidEmail(email) && (
          <SignupMinAgeWrap>
            <SignupMinAgeCheck>
              옳바른 이메일 형식이 아닙니다.
            </SignupMinAgeCheck>
          </SignupMinAgeWrap>
        )}
        <ProfileEmailDetailInfo>
          {`현재 ${data?.nickname}님의 이메일은 ${data?.email ? data.email + '입니다' : '아직 등록 되지 않았습니다.'} 이메일은 ${APP_SERVICE_NAME}의 내 공개 프로필에 표시되지 않습니다.`}
        </ProfileEmailDetailInfo>

        <BottomNextButton
          title={SETTING_EDIT_BUTTON_PHASE_TEXT}
          notActiveTitle={SETTING_EDIT_BUTTON_PHASE_TEXT}
          isActive={email !== '' && isValidEmail(email)}
          actionFunc={onClickEditEmail}
        />
      </ProfileEditEmailContainer>
    </>
  );
};

const ProfileEditEmailContainer = styled.div`
  padding-top: 30px;
`;

const ProfileEditEmailInputWrap = styled.div`
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const ProfileEditEmailInput = styled.input`
  padding: 15px 16px;
  background-color: ${({ theme }) => theme.mainColor.White};
  border: 1px solid ${({ theme }) => theme.grey.Grey2};
  width: 100%;
  box-sizing: border-box;

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

const ProfileEmailDetailInfo = styled.div`
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey7};
  margin-top: 10px;
`;

export default ProfileAccountEmailEditBody;
