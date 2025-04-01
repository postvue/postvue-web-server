import {
  SIGNUP_NICKNAME_MAX_SIZE,
  SIGNUP_NICKNAME_MIN_SIZE,
} from 'const/SignupConst';
import { isValidNickname } from 'global/util/ValidUtil';
import useAutoBlur from 'hook/customhook/useAutoBlur';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  signStepTransitionInfoAtom,
  signupInfoAtom,
  signupStepNumAtom,
} from 'states/SignupAtom';
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
  const setSignStepTransitionInfo = useSetRecoilState(
    signStepTransitionInfoAtom,
  );

  useAutoBlur([]);

  useEffect(() => {
    if (isValidNickname(nickname)) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [nickname]);

  const setSignupStepNum = useSetRecoilState(signupStepNumAtom);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === 'Enter' &&
      event.nativeEvent.isComposing === false &&
      isActive
    ) {
      setSignStepTransitionInfo({
        inTransition: true,
        direction: 'left',
      });
      setSignupStepNum((prev) => prev + 1);
    }
  };

  return (
    <>
      <SignupHeader />
      <SignupStepTitleWrap>
        <SignupStepTitle>닉네임을 정해주세요.</SignupStepTitle>
        <SignupStepSubTitle>
          앱에서 표시될 별명입니다. 언제든지 설정에서 바꿀 수 있어요.
        </SignupStepSubTitle>
      </SignupStepTitleWrap>
      <SignupInputWrap>
        <SignupNicknameInput
          placeholder="닉네임을 정해주세요."
          value={nickname}
          onChange={(e) => onChangeNickname(e)}
          onKeyDown={(e) => handleKeyPress(e)}
        />
        {nickname !== '' && !isValidNickname(nickname) && (
          <NicknameExistenceWrap>
            {isValidNickname(nickname) ? (
              <>
                {nickname.length < SIGNUP_NICKNAME_MIN_SIZE ? (
                  <NicknameIsExistedExistence>
                    두 글자 이상 작성해주어야 됩닏.
                  </NicknameIsExistedExistence>
                ) : (
                  <>
                    {nickname.length > SIGNUP_NICKNAME_MAX_SIZE && (
                      <NicknameIsExistedExistence>
                        사용자 아이디는 {SIGNUP_NICKNAME_MAX_SIZE}자 이하여야
                        합니다.
                      </NicknameIsExistedExistence>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <NicknameIsExistedExistence>
                  맨 앞 두 글자는 공백 및 특수문자를 제외한 글자 및 밑줄(_)
                  가능합니다.
                </NicknameIsExistedExistence>
              </>
            )}
          </NicknameExistenceWrap>
        )}
      </SignupInputWrap>

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

const SignupInputWrap = styled.div`
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  flex: 1;
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
  margin: 7px 0px 0px 0px;
`;

const NicknameIsExistence = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
`;

const NicknameIsExistedExistence = styled(NicknameIsExistence)`
  color: ${({ theme }) => theme.errorColor.Red};
`;

export default SignupNicknameStep;
