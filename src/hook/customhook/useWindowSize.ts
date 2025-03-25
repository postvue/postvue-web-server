import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { windowSizeAtom } from 'states/SystemConfigAtom';

// @REFER: 버전 1
// const useWindowSize = (): { windowWidth: number; windowHeight: number } => {
//   const [windowSize, setWindowSize] = useState({
//     windowWidth: window.innerWidth,
//     windowHeight: window.innerHeight,
//   });

//   useEffect(() => {
//     const handleResize = () => {
//       setWindowSize({
//         windowWidth: window.innerWidth,
//         windowHeight: window.innerHeight,
//       });
//     };

//     // 창 크기 변경 이벤트 등록
//     window.addEventListener('resize', handleResize);

//     // 초기 값 설정
//     handleResize();

//     // 컴포넌트 언마운트 시 이벤트 제거
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return windowSize;
// };

// export default useWindowSize;

// 버전 2
const useWindowSize = (): { windowWidth: number; windowHeight: number } => {
  const windowSize = useRecoilValue(windowSizeAtom); // 단순히 값을 읽기만 함
  return windowSize;
};

export const WindowSizeListener = (): null => {
  const setWindowSize = useSetRecoilState(windowSizeAtom);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize((prevState) => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        if (
          prevState.windowWidth !== newWidth ||
          prevState.windowHeight !== newHeight
        ) {
          return { windowWidth: newWidth, windowHeight: newHeight };
        }
        return prevState;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setWindowSize]);

  return null; // UI를 렌더링하지 않음
};

export default useWindowSize;
