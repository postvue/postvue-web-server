import { useDrag } from '@use-gesture/react';
import React, { useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import styled from 'styled-components';

const THRESHOLD = 150;

const height = 148;

const TestLayout: React.FC = () => {
  const [up, setUp] = useState(false);
  const [{ y }, set] = useSpring(() => ({ y: height }));
  const props = useDrag(
    ({ movement: [x, y], down }) => {
      if (!down) {
        if (up) {
          set({ y: height });
          setUp(false);
        } else {
          set({ y: 0 });
          setUp(true);
        }
        return;
      }
      if (!down) {
        if (y > THRESHOLD) {
          set({ y: height });
          setUp(false);
        } else {
          set({ y: 0 });
          setUp(true);
        }
      } else {
        set({ y });
      }
      //   if (!down && Math.abs(y) > THRESHOLD) {
      //     if (y > THRESHOLD) {
      //       set({ y: 148 });
      //       setUp(false);
      //     } else {
      //       set({ y: 0 });
      //       setUp(true);
      //     }
      //   } else {
      //     if (Math.abs(y) > THRESHOLD) {
      //       set({ y });
      //     }
      //   }
      //   if (!down && last) {
      //     // 드래그 동작이 끝났을 때 y 값 기준으로 bottom sheet 위치 결정
      //     if (Math.abs(y) > THRESHOLD) {
      //       if (y > THRESHOLD) {
      //         set({ y: 148 });
      //         setUp(false);
      //       } else {
      //         set({ y: 0 });
      //         setUp(true);
      //       }
      //     }
      //   } else if (down) {
      //     console.log('흠', y);
      //     if (Math.abs(y) > THRESHOLD) {
      //       set({ y });
      //     }
      //   }
    },
    {
      from: () => [0, y.get()],
      bounds: { left: 0, right: 0, top: 0, bottom: height },
      rubberband: false,
    },
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);
  return (
    <TestLayoutContainer>
      <BottomSheet
        as={animated.div}
        {...props()}
        style={{ y }}
        className={'hello'}
      >
        <BottomSheetBar />
        <animated.div
          style={{
            transform: y.to((y) => `translateY(${0.05 * y}px)`),
          }}
        >
          <BottomSheetItem>
            <BottomSheetImage
              as={animated.img}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7LpapIl8DITfz4_Y2z7pqs7FknPkjReAZCg&s"
            />
            <BottomSheetText
              as={animated.div}
              style={{
                transform: y.to((y) => `translateX(${3 * y}px)`),
              }}
            >
              Mikaela Skärström
              <BottomSheetOrigin>Västerås</BottomSheetOrigin>
            </BottomSheetText>
          </BottomSheetItem>
          <BottomSheetItem>
            <BottomSheetImage
              as={animated.img}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7LpapIl8DITfz4_Y2z7pqs7FknPkjReAZCg&s"
            />
            <BottomSheetText
              as={animated.div}
              style={{
                transform: y.to((y) => `translateX(${3 * y}px)`),
              }}
            >
              Mikaela Skärström
              <BottomSheetOrigin>Västerås</BottomSheetOrigin>
            </BottomSheetText>
          </BottomSheetItem>
          <BottomSheetItem>
            <BottomSheetImage
              as={animated.img}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7LpapIl8DITfz4_Y2z7pqs7FknPkjReAZCg&s"
            />
            <BottomSheetText
              as={animated.div}
              style={{
                transform: y.to((y) => `translateX(${3 * y}px)`),
              }}
            >
              Mikaela Skärström
              <BottomSheetOrigin>Västerås</BottomSheetOrigin>
            </BottomSheetText>
          </BottomSheetItem>
          <BottomSheetItem>
            <BottomSheetImage
              as={animated.img}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7LpapIl8DITfz4_Y2z7pqs7FknPkjReAZCg&s"
            />
            <BottomSheetText
              as={animated.div}
              style={{
                transform: y.to((y) => `translateX(${3 * y}px)`),
              }}
            >
              Mikaela Skärström
              <BottomSheetOrigin>Västerås</BottomSheetOrigin>
            </BottomSheetText>
          </BottomSheetItem>
        </animated.div>
        <BottomSheetParticipants
          as={animated.div}
          style={{ x: y.to((y) => 1.5 * (148 - y)) }}
        >
          4 devs
          <BottomSheetStatement>1 mission</BottomSheetStatement>
        </BottomSheetParticipants>
      </BottomSheet>
    </TestLayoutContainer>
  );
};

const TestLayoutContainer = styled.div`
  align-items: center;
  background-color: #b4c7bf;
  display: flex;
  font-family: Hack, monospace;
  justify-content: center;
`;

const PhoneContainer = styled.div`
  background-color: #fff;
  border-radius: 30px;
  height: 500px;
  overflow: hidden;
  position: relative;
  width: 260px;
`;

const BottomSheet = styled.div`
  background-color: #e6eaeb;
  border-top-left-radius: 40px;
  bottom: 0;
  cursor: grab;
  height: 800px;
  position: absolute;
  width: 100%;
`;

const BottomSheetBar = styled.div`
  background: #ccc;
  border-radius: 2px;
  height: 4px;
  left: 50%;
  position: absolute;
  top: 8px;
  transform: translateX(-50%);
  width: 56px;
`;

const BottomSheetItem = styled.div`
  align-items: center;
  display: flex;

  &:first-child {
    margin-top: 20px;
  }
`;

const BottomSheetImage = styled.img`
  background-color: #fff;
  border-radius: 23px;
  border: 4px solid #e6eaeb;
  display: block;
  height: 38px;
  margin: 6px 0 0 24px;
  width: 38px;
  user-select: none;
`;

const BottomSheetText = styled.div`
  background-color: white;
  border-bottom-left-radius: 21px;
  border-top-left-radius: 21px;
  font-size: 14px;
  font-weight: 900;
  margin-left: 12px;
  margin-top: 4px;
  padding: 8px 0 8px 20px;
  width: 156px;
  user-select: none;
`;

const BottomSheetOrigin = styled.div`
  font-size: 10px;
  font-weight: 100;
`;

const BottomSheetParticipants = styled.div`
  font-weight: 900;
  position: absolute;
  right: 24px;
  top: 40px;
  user-select: none;
`;

const BottomSheetStatement = styled.div`
  font-size: 10px;
  font-weight: 100;
`;

export default TestLayout;
