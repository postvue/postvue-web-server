import React from 'react';
import {
  Bounce,
  ToastContainer,
  ToastTransitionProps,
  toast,
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import theme from '../../styles/theme';

// Notify 함수
export const notify = (
  toastMsgText: string,
  transition: ({
    children,
    position,
    preventExitTransition,
    done,
    nodeRef,
    isIn,
    playToast,
  }: ToastTransitionProps) => React.JSX.Element = Bounce,
): void => {
  toast(toastMsgText, {
    position: 'bottom-center',
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: transition,
    closeButton: false,
    className: 'custom-toast',
    // bodyClassName: 'custom-body',
  });
};

interface ToastPopupProps {
  backgroundColor?: string;
}

const ToastPopup: React.FC<ToastPopupProps> = ({
  backgroundColor = theme.mainColor.Blue,
}) => {
  return <StyledToastContainer $backgroundColor={backgroundColor} />;
};

// ToastContainer 스타일 정의
const StyledToastContainer = styled(ToastContainer)<{
  $backgroundColor: string;
}>`
  &&&.Toastify__toast-container {
    // position: fixed;
    // top: 50px;
    // left: 50%;
    z-index: 200;
    pointer-events: none;
    display: flex;
    justify-content: center;
    min-height: 20px;
  }

  .custom-toast {
    background-color: ${(props) => props.$backgroundColor};
    text-align: center;
    color: white;
    font: ${({ theme }) => theme.fontSizes.Body4};
    border-radius: 5px;

    // width: 80px;
    min-height: 20px;
    margin-bottom: 35px;
  }

  .custom-body {
    display: flex;
    align-items: center;
    padding: 0px;
  }
`;

export default ToastPopup;
