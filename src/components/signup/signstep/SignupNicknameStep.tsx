import { SIGNUP_NICKNAME_MAX_SIZE } from 'const/SignupConst';
import { isValidNickname } from 'global/util/ValidUtil';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { signupInfoAtom } from 'states/SignupAtom';
import styled from 'styled-components';
import SignupHeader from '../SignupHeader';
import SignupNextButton from '../SignupNextButton';

const SignupNicknameStep: React.FC = () => {
  const [signupInfo, setSignupInfo] = useRecoilState(signupInfoAtom);

  const [isActive, setIsActive] = useState<boolean>(false);

  const [nickname, setNickname] = useState<string>(signupInfo.nickname);
  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setSignupInfo((prev) => ({ ...prev, nickname: e.target.value }));
  };

  useEffect(() => {
    if (isValidNickname(nickname)) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [nickname]);

  return (
    <>
      <SignupHeader />
      <SignupStepTitleWrap>
        <SignupStepTitle>이름은 어떻게 되시나요?</SignupStepTitle>
        <SignupStepSubTitle>
          친구들과 사람들에게 표시되는 이름입니다.
        </SignupStepSubTitle>
      </SignupStepTitleWrap>
      <SignupInputWrap>
        <SignupNicknameInput
          placeholder="이름을 넣어주세요."
          value={nickname}
          onChange={(e) => onChangeNickname(e)}
        />
      </SignupInputWrap>
      {nickname !== '' && !isValidNickname(nickname) && (
        <NicknameExistenceWrap>
          {nickname.length <= SIGNUP_NICKNAME_MAX_SIZE && (
            <NicknameIsExistedExistence>
              밑줄(_) 이외의 특수문자는 허용되지 않습니다.
            </NicknameIsExistedExistence>
          )}
          {nickname.length > SIGNUP_NICKNAME_MAX_SIZE && (
            <NicknameIsExistedExistence>
              사용자 아이디는 {SIGNUP_NICKNAME_MAX_SIZE}자 이하여야 합니다.
            </NicknameIsExistedExistence>
          )}
        </NicknameExistenceWrap>
      )}
      <SignupNextButton isActive={isActive} />
    </>
  );
};

const SignupStepTitleWrap = styled.div`
  padding: calc(30px + ${({ theme }) => theme.systemSize.header.height}) 0px
    50px 0px;
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

const SignupInputWrap = styled.div`
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

const NicknameExistenceWrap = styled.div`
  margin: 7px 0px 0px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const NicknameIsExistence = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
`;

const NicknameIsExistedExistence = styled(NicknameIsExistence)`
  color: ${({ theme }) => theme.errorColor.Red};
`;

export default SignupNicknameStep;
