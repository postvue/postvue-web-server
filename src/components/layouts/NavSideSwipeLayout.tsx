/* eslint-disable react/prop-types */
import { animated, useSprings } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

import { useRef } from 'react';

import { clamp } from 'lodash';
import React from 'react';
import styled from 'styled-components';

interface NavSideSwipeLayoutProps {
  swipeElementList: React.ReactNode[];
}

const NavSideSwipeLayout: React.FC<NavSideSwipeLayoutProps> = ({
  swipeElementList,
}) => {
  const pages = [
    'https://images.pexels.com/photos/62689/pexels-photo-62689.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    // 'https://images.pexels.com/photos/733853/pexels-photo-733853.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    'https://images.pexels.com/photos/4016596/pexels-photo-4016596.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    // 'https://images.pexels.com/photos/351265/pexels-photo-351265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    // 'https://images.pexels.com/photos/924675/pexels-photo-924675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  ];

  const index = useRef(0);
  const width = window.innerWidth;

  const [props, api] = useSprings(pages.length, (i) => ({
    x: i * width,
    scale: 1,
    display: 'block',
  }));
  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], cancel }) => {
      if (active && Math.abs(mx) > width / 3) {
        index.current = clamp(
          index.current + (xDir > 0 ? -1 : 1),
          0,
          pages.length - 1,
        );
        cancel();
      }
      api.start((i) => {
        if (i < index.current - 1 || i > index.current + 1)
          return { display: 'none' };
        const x = (i - index.current) * width + (active ? mx : 0);
        const scale = active ? 1 - Math.abs(mx) / width / 2 : 1;
        return { x, scale, display: 'block' };
      });
    },
  );
  return (
    <Flex>
      <Wrapper as={animated.div}>
        {props.map(({ x, display, scale }, i) => (
          <Page {...bind()} key={i} style={{ display, x }} as={animated.div}>
            <Sheet as={animated.div}>
              <div style={{ display: 'flex', flexFlow: 'column' }}>
                <img src={pages[i]} />
              </div>
            </Sheet>
          </Page>
        ))}
      </Wrapper>
    </Flex>
  );
};

const Flex = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: center;
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Sheet = styled.div`
  touch-action: none;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  width: 100%;
  height: 100%;
  box-shadow:
    0 62.5px 125px -25px rgba(50, 50, 73, 0.5),
    0 37.5px 75px -37.5px rgba(0, 0, 0, 0.6);
`;

const Page = styled.div``;

export default NavSideSwipeLayout;
