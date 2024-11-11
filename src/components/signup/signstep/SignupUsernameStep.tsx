import {
  SIGNUP_USERNAME_MAX_SIZE,
  SIGNUP_USERNAME_MIN_SIZE,
} from 'const/SignupConst';
import { getSearchQueryByDebounce } from 'global/util/SearchUtil';
import { isValidUsername } from 'global/util/ValidUtil';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { getProfileExistenceByUsername } from 'services/profile/getProfileExistenceByUsername';
import {
  signupInfoAtom,
  signupUsernameExistenceHashMapAtom,
} from 'states/SignupAtom';
import styled from 'styled-components';
import SignupHeader from '../SignupHeader';
import SignupNextButton from '../SignupNextButton';

const SignupUsernameStep: React.FC = () => {
  const [loading, setLoading] = useState(false); // Loading state

  const [signupUsernameExistenceHashMap, setSignupUsernameExistenceHashMap] =
    useRecoilState(signupUsernameExistenceHashMapAtom);
  const [signupInfo, setSignupInfo] = useRecoilState(signupInfoAtom);

  const [isActive, setIsActive] = useState<boolean>(false);

  const [username, setUsername] = useState<string>(signupInfo.username);

  const debouncedGetSearchQuery = getSearchQueryByDebounce(
    (word: string) => {
      if (!isValidUsername(word)) {
        setLoading(false);
      } else {
        if (!signupUsernameExistenceHashMap.has(word)) {
          getProfileExistenceByUsername(word)
            .then((value) => {
              const tempSignupUsernameExistenceHashMap = new Map(
                signupUsernameExistenceHashMap,
              );
              tempSignupUsernameExistenceHashMap.set(word, value.isExisted);
              setSignupUsernameExistenceHashMap(
                tempSignupUsernameExistenceHashMap,
              );
            })
            .finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      }
    },
    [signupUsernameExistenceHashMap],
  );

  const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const username = event.target.value;
    setLoading(true);

    debouncedGetSearchQuery(username);

    setUsername(event.target.value);
    setSignupInfo((prev) => ({ ...prev, username: event.target.value }));
  };

  useEffect(() => {
    const existInfo = signupUsernameExistenceHashMap.get(username);

    if (!loading) {
      if (!isValidUsername(username) || existInfo) {
        setIsActive(false);
      } else {
        setIsActive(true);
      }
    } else {
      setIsActive(false);
    }
  }, [username, loading]);

  return (
    <>
      <SignupHeader />
      <SignupStepTitleWrap>
        <SignupStepTitle>사용자 아이디를 입력해주세요.</SignupStepTitle>
        <SignupStepSubTitle></SignupStepSubTitle>
      </SignupStepTitleWrap>
      <SignupDateWrap>
        <SignupNicknameInput
          placeholder="아이디를 넣어주세요."
          value={username}
          onChange={(e) => onSearchInputChange(e)}
        />
      </SignupDateWrap>

      {!loading && username !== '' && !isValidUsername(username) && (
        <UsernameExistenceWrap>
          {username.length < SIGNUP_USERNAME_MIN_SIZE && (
            <UsernameIsExistedExistence>
              사용자 아이디는 {SIGNUP_USERNAME_MIN_SIZE}자 이상이어야 합니다.
            </UsernameIsExistedExistence>
          )}
          {username.length >= SIGNUP_USERNAME_MIN_SIZE && (
            <>
              {username.length < SIGNUP_USERNAME_MAX_SIZE && (
                <UsernameIsExistedExistence>
                  아이디는 공백없이 첫 글자는 영어, 나머지는 알파벳, 숫자,
                  밑줄(_) 만 허용됩니다.
                </UsernameIsExistedExistence>
              )}
              {username.length > SIGNUP_USERNAME_MAX_SIZE && (
                <UsernameIsExistedExistence>
                  사용자 아이디는 {SIGNUP_USERNAME_MAX_SIZE}자 이하여야 합니다.
                </UsernameIsExistedExistence>
              )}
            </>
          )}
        </UsernameExistenceWrap>
      )}
      {!loading &&
        isValidUsername(username) &&
        signupUsernameExistenceHashMap.has(username) && (
          <UsernameExistenceWrap>
            {signupUsernameExistenceHashMap.get(username) ? (
              // 존재함
              <UsernameIsExistedExistence>
                이미 존재하는 아이디입니다.
              </UsernameIsExistedExistence>
            ) : (
              // 존재하지 않음
              <UsernameIsNotExistedExistence>
                사용가능한 아이디입니다.
              </UsernameIsNotExistedExistence>
            )}
          </UsernameExistenceWrap>
        )}
      <SignupNextButton isActive={isActive} />
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

const SignupNicknameInput = styled.input`
  padding: 15px 16px;
  background-color: ${({ theme }) => theme.grey.Grey1};
  border: 0px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  border-radius: 20px;
  font: ${({ theme }) => theme.fontSizes.Body2};
`;

const UsernameExistenceWrap = styled.div`
  margin: 7px 0px 0px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const UsernameIsExistence = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
`;

const UsernameIsExistedExistence = styled(UsernameIsExistence)`
  color: ${({ theme }) => theme.errorColor.Red};
`;

const UsernameIsNotExistedExistence = styled(UsernameIsExistence)`
  color: ${({ theme }) => theme.mainColor.Blue};
`;

export default SignupUsernameStep;
