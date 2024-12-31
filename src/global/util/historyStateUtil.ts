import { useNavigate, useNavigationType } from 'react-router-dom';

export const useGoBackOrNavigate = (fallbackUrl: string): (() => void) => {
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  const goBackOrNavigate = () => {
    const previousPath = document.referrer; // 이전 경로 (document.referrer 사용)
    console.log('이전 경로', previousPath);
    console.log(location.pathname);
    console.log('현재 위치', window.location.origin);
    const isValidPreviousPath =
      previousPath && previousPath.startsWith(window.location.origin);

    console.log('콩');
    console.log(navigationType);
    console.log(isValidPreviousPath);
    if (isValidPreviousPath) {
      // 이전 페이지가 있고 유효한 경로라면 뒤로가기

      navigate(-1);
    } else {
      console.log('콩');
      console.log(window.history.length);
      // 이전 페이지가 없거나 유효하지 않다면 fallbackUrl로 이동
      navigate(fallbackUrl);
    }
  };

  return goBackOrNavigate;
};
