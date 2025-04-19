import { isApp } from 'global/util/reactnative/nativeRouter';
import { useEffect } from 'react';

// 중앙에서 메시지를 관리하는 모듈
const messageHandlers: Array<(event: MessageEvent) => void> = [];

// 메시지 리스너를 전역에서 단 1회만 등록
if (typeof window !== 'undefined') {
  window.addEventListener('message', (event) => {
    messageHandlers.forEach((handler) => handler(event));
  });
}

// 커스텀 훅으로 핸들러를 관리
export const useMessageListener = (
  handler: (event: MessageEvent) => void,
): void => {
  if (!isApp()) return;
  useEffect(() => {
    // 핸들러를 등록
    messageHandlers.push(handler);

    // 컴포넌트 언마운트 시 핸들러 제거
    return () => {
      const index = messageHandlers.indexOf(handler);
      if (index > -1) {
        messageHandlers.splice(index, 1);
      }
    };
  }, [handler]); // handler가 변경되면 다시 등록
};
