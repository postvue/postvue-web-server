// import { ViewPagerTabScrollInterface } from 'global/interface/pageInterface';
import React from 'react';
// import SwipeableViews from 'react-swipeable-views';
// import { SetterOrUpdater } from 'recoil';

// interface ViewPagerLayoutProps {
//   tabId: number;
//   setTabId: SetterOrUpdater<number>;
//   children: React.ReactNode;
//   tabScrollInfoList: ViewPagerTabScrollInterface[];
//   setTabScrollInfoList: SetterOrUpdater<ViewPagerTabScrollInterface[]>;
// }

// const ViewPagerLayout: React.FC<ViewPagerLayoutProps> = ({
//   tabId,
//   setTabId,
//   children,
//   tabScrollInfoList,
//   setTabScrollInfoList,
// }) => {
//   const prevTabId = useRef<number>(tabId);
//   const [isVisibility, setVisibility] = useState<boolean>(true);

//   useEffect(() => {
//     const tempTabScrollInfoList = [...tabScrollInfoList];
//     const tabScrollInfo = { ...tempTabScrollInfoList[prevTabId.current] };
//     tabScrollInfo.scroll = window.scrollY;
//     tempTabScrollInfoList[prevTabId.current] = tabScrollInfo;
//     setTabScrollInfoList(tempTabScrollInfoList);

//     setTimeout(() => {
//       setVisibility(true);
//       window.scrollTo({ top: tempTabScrollInfoList[tabId].scroll });
//     }, 0);
//     prevTabId.current = tabId;
//   }, [tabId]);

//   const [isDragging, setIsDragging] = useState(false);

//   const handleDragStart = () => {
//     setIsDragging(true);
//     // setVisibility(false);
//   };

//   const handleDragEnd = () => {
//     setIsDragging(false);
//   };

//   return (
//     <SwipeableViews
//       index={tabId}
//       resistance
//       onChangeIndex={(index) => {
//         setTabId(index);
//         handleDragEnd();
//       }}
//       containerStyle={{
//         // height: window.innerHeight,
//         visibility: isVisibility ? 'visible' : 'hidden',
//         WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
//       }}
//       onSwitching={(index, type) => {
//         if (type === 'move')
//           handleDragStart(); // 드래그 중 상태
//         else handleDragEnd(); // 드래그 종료 상태
//       }}
//     >
//       {children}
//     </SwipeableViews>
//   );
// };

// export default ViewPagerLayout;

const test: React.FC = () => {
  return <div></div>;
};

export default test;
