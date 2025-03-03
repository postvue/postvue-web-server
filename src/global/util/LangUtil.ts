import { franc } from 'franc-min';

export const checkLanguage = (input: string): string => {
  const lang = franc(input); // ISO 639-3 코드 반환
  // setIsEnglish(lang === "eng"); // 영어인지 확인
  return lang;
};
