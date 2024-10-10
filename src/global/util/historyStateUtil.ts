import { useNavigate, useNavigationType } from 'react-router-dom';

export const useGoBackOrNavigate = (fallbackUrl: string): (() => void) => {
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  const goBackOrNavigate = () => {
    if (navigationType === 'POP') {
      // 이전 페이지가 있으면 뒤로가기
      navigate(-1);
    } else {
      // 이전 페이지가 없으면 fallbackUrl로 이동
      navigate(fallbackUrl);
    }
  };

  return goBackOrNavigate;
};
