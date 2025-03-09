import { useNavigate } from 'react-router-dom';

export const useGoBackOrNavigate = (fallbackUrl: string): (() => void) => {
  const navigate = useNavigate();

  const goBackOrNavigate = () => {
    if (document.referrer) {
      window.history.back(); // 사용자가 이전 페이지가 있을 경우 이동
    } else {
      navigate(fallbackUrl);
    }
  };

  return goBackOrNavigate;
};
