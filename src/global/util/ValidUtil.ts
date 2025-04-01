import {
  SIGNUP_NICKNAME_MAX_SIZE,
  SIGNUP_NICKNAME_MIN_SIZE,
  SIGNUP_USERNAME_MAX_SIZE,
  SIGNUP_USERNAME_MIN_SIZE,
} from 'const/SignupConst';

export const isValidString = (str: string): boolean => {
  return str !== null && !/^\s*$/.test(str);
};

//최소 5글자, 최대 20글자까지 입력 가능합니다.
//첫 글자는 알파벳이어야 하며, 공백 없이 알파벳, 숫자, _ 만 허용됩니다.
export const isValidUsername = (str: string): boolean => {
  const NAME_REGEX = new RegExp(
    `^[a-zA-Z][a-zA-Z0-9_]{${SIGNUP_USERNAME_MIN_SIZE - 1},${SIGNUP_USERNAME_MAX_SIZE - 1}}$`,
  );

  return NAME_REGEX.test(str);
};

//최소 5글자, 최대 20글자까지 입력 가능합니다.
//첫 글자는 알파벳이어야 하며, 공백 없이 알파벳, 숫자, _ 만 허용됩니다.
export const isValidNickname = (str: string): boolean => {
  // const NAME_REGEX = new RegExp(
  //   `^(?!.*\\s)[\\p{L}_0-9-]{${SIGNUP_NICKNAME_MIN_SIZE},${SIGNUP_NICKNAME_MAX_SIZE - 1}}$`,
  //   'u',
  // );

  const NAME_REGEX = new RegExp(
    `^[\\p{L}0-9_]{${SIGNUP_NICKNAME_MIN_SIZE}}.{0,${SIGNUP_NICKNAME_MAX_SIZE - SIGNUP_NICKNAME_MIN_SIZE}}$`,
    'u',
  );

  return NAME_REGEX.test(str);
};

export const checkLengthByPassword = (password: string): boolean => {
  const lengthRegex = /^.{8,20}$/;

  return lengthRegex.test(password);
};

export const checkFirstCharIsLetterRegexByPassword = (
  password: string,
): boolean => {
  const firstCharIsLetterRegex = /^[a-zA-Z]/;

  return firstCharIsLetterRegex.test(password);
};

export const checkValidCharsRegexByPassword = (password: string): boolean => {
  const validCharsRegex = /^[a-zA-Z0-9!@_]+$/;

  return validCharsRegex.test(password);
};

export const checkSpecialCharRegexByPassword = (password: string): boolean => {
  const specialCharRegex = /[!@_]/;

  return specialCharRegex.test(password);
};

export const isValidPassword = (password: string): boolean => {
  return (
    checkLengthByPassword(password) &&
    checkFirstCharIsLetterRegexByPassword(password) &&
    checkValidCharsRegexByPassword(password) &&
    checkSpecialCharRegexByPassword(password)
  );
};

export const isValidEmail = (email: string): boolean => {
  const EMAIL_REGEX = new RegExp(`^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$`);

  return EMAIL_REGEX.test(email);
};
