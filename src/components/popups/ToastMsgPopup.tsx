import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import React from 'react';
import {
  Slide,
  ToastContainer,
  ToastTransitionProps,
  toast,
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import theme from '../../styles/theme';

interface NotifyProps {
  msgIcon?: React.ReactNode;
  msgTitle?: string;
  rightNode?: React.ReactNode;
  autoClose?: number;
}

// Notify 함수
export const notify = (data: NotifyProps): void => {
  const onTransition: ({
    children,
    position,
    preventExitTransition,
    done,
    nodeRef,
    isIn,
    playToast,
  }: ToastTransitionProps) => React.JSX.Element = Slide;
  toast(
    <PostScrapNotificationWrap>
      <PostScrapNotificationSubWrap>
        <PostScrapNotificationIconWrap>
          {data.msgIcon}
        </PostScrapNotificationIconWrap>
        <PostScrapNotificationTitle>{data.msgTitle}</PostScrapNotificationTitle>
      </PostScrapNotificationSubWrap>
      <div
        onClick={() => {
          toast.dismiss();
        }}
      >
        {data.rightNode}
      </div>
    </PostScrapNotificationWrap>,
    {
      position: 'bottom-center',
      autoClose: data.autoClose ? data.autoClose : 500,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'black',
      transition: onTransition,
      closeButton: true,
      className: 'custom-toast',
      draggablePercent: 20,
      // bodyClassName: 'custom-body',
    },
  );
};

interface ToastPopupProps {
  backgroundColor?: string;
}

const ToastPopup: React.FC<ToastPopupProps> = ({
  backgroundColor = theme.mainColor.Black,
}) => {
  return <StyledToastContainer $backgroundColor={backgroundColor} />;
};

// ToastContainer 스타일 정의
const StyledToastContainer = styled(ToastContainer)<{
  $backgroundColor: string;
}>`
  &.Toastify__toast-container {
    --toastify-toast-speed: 0.01s;

    @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
      margin: 0 15px ${10}px 15px;
      width: calc(100% - 30px);
    }
  }

  &.Toastify__toast--enter {
    animation-duration: var(--toastify-toast-speed) !important;
  }

  .custom-toast {
    background-color: ${(props) => props.$backgroundColor};
    text-align: center;
    color: white;
    font: ${({ theme }) => theme.fontSizes.Body4};
    border-radius: 5px;

    min-height: 20px;
  }

  .custom-body {
    display: flex;
    align-items: center;
    padding: 0px;
  }
`;

const PostScrapNotificationWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PostScrapNotificationSubWrap = styled.div`
  display: flex;
  gap: 10px;
`;

const PostScrapNotificationIconWrap = styled.div`
  display: flex;
  margin: auto 0px;
`;

const PostScrapNotificationTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
`;

export default ToastPopup;
