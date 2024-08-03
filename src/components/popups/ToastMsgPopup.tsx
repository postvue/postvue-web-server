import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

// Notify 함수
export const notify = (toastMsgText: string): void => {
  toast(toastMsgText, {
    position: 'top-center',
    autoClose: 1500,
    hideProgressBar: true,
    pauseOnHover: false,
    progress: undefined,
    className: 'custom-toast',
    bodyClassName: 'custom-body',
    closeButton: false,
  });
};

// ToastContainer 스타일 정의
const StyledToastContainer = styled(ToastContainer)`
  &&&.Toastify__toast-container {
    position: fixed;
    top: 50px;
    left: 50%;
    z-index: 100;
    pointer-events: none;
    display: flex;
    justify-content: center;
    min-height: 20px;
  }

  .custom-toast {
    background-color: ${({ theme }) => theme.mainColor.Blue};
    text-align: center;
    color: white;
    font: ${({ theme }) => theme.fontSizes.Body4};
    border-radius: 5px;

    width: 80px;
    min-height: 20px;
  }

  .custom-body {
    display: flex;
    align-items: center;
    padding: 0px;
  }
`;

const ToastPopup: React.FC = () => {
  return <StyledToastContainer />;
};

export default ToastPopup;
