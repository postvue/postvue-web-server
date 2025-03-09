import { useEffect } from 'react';

const usePullToRefresh = (
  ref: React.RefObject<HTMLDivElement>,
  onTrigger: () => void,
): void => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // attach the event listener
    el.addEventListener('touchstart', handleTouchStart);

    function handleTouchStart(startEvent: TouchEvent) {
      const el = ref.current;
      if (!el) return;

      // get the initial Y position
      const initialY = startEvent.touches[0].clientY;

      el.addEventListener('touchmove', handleTouchMove);
      el.addEventListener('touchend', handleTouchEnd);

      function handleTouchMove(moveEvent: TouchEvent) {
        const el = ref.current;
        if (!el) return;

        // get the current Y position
        const currentY = moveEvent.touches[0].clientY;

        // get the difference
        const dy = currentY - initialY;

        // update the element's transform
        el.style.transform = `translateY(${dy}px)`;
      }

      function handleTouchEnd() {
        const el = ref.current;
        if (!el) return;

        // return the element to its initial position
        el.style.transform = 'translateY(0)';

        // add transition
        el.style.transition = 'transform 0.2s';

        // listen for transition end event
        el.addEventListener('transitionend', onTransitionEnd);

        // cleanup
        el.removeEventListener('touchmove', handleTouchMove);
        el.removeEventListener('touchend', handleTouchEnd);
      }

      function onTransitionEnd() {
        const el = ref.current;
        if (!el) return;

        // remove transition
        el.style.transition = '';

        // cleanup
        el.removeEventListener('transitionend', onTransitionEnd);
      }
    }

    return () => {
      // let's not forget to cleanup
      el.removeEventListener('touchstart', handleTouchStart);
    };
  }, [ref.current]);
};

export default usePullToRefresh;
