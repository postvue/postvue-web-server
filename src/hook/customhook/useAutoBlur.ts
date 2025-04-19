import { useEffect, useRef, useState } from 'react';

function useAutoBlur(
  excludeRefs: React.RefObject<HTMLElement>[] = [], // 예외 요소들 (옵션)
  customTags: string[] = ['INPUT', 'TEXTAREA'], // 감지할 입력 필드 태그 (기본값)
  callback?: () => void, // 키보드 닫힌 후 실행할 콜백 (옵션)
  isStartEvent = true,
): void {
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (
        customTags.includes(target.tagName) ||
        target.getAttribute('contenteditable') === 'true'
      ) {
        // 키보드 활성화 플래그 설정 (일정 시간 후 감지 시작)
        timerRef.current = setTimeout(() => setIsKeyboardActive(true), 300);
      }
    };

    const handleInteraction = (event: Event) => {
      const activeElement = document.activeElement as HTMLElement;

      if (
        !isKeyboardActive ||
        !activeElement ||
        (!customTags.includes(activeElement.tagName) &&
          activeElement.getAttribute('contenteditable') !== 'true')
      )
        return;
      if (
        excludeRefs.some(
          (ref) => ref.current && ref.current.contains(event.target as Node),
        )
      )
        return;

      // 키보드 닫기

      activeElement.blur();
      setIsKeyboardActive(false);
      if (callback) callback(); // 추가 콜백 실행 (필요 시)
    };
    const handleFocusOut = () => {
      // 외부 클릭으로 인해 포커스 해제될 때에도 감지하여 callback 실행
      if (isKeyboardActive) {
        setIsKeyboardActive(false);
        if (callback) callback();
      }
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleFocusOut); // 추가: 포커스 해제 감지
    document.addEventListener('scroll', handleInteraction, true);
    if (isStartEvent) {
      document.addEventListener('touchstart', handleInteraction, true);
      document.addEventListener('mousedown', handleInteraction, true);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleFocusOut); // 추가 해제
      document.removeEventListener('scroll', handleInteraction, true);
      if (isStartEvent) {
        document.removeEventListener('touchstart', handleInteraction, true);
        document.removeEventListener('mousedown', handleInteraction, true);
      }
    };
  }, [excludeRefs, isKeyboardActive, callback, customTags]);

  return;
}

export default useAutoBlur;
