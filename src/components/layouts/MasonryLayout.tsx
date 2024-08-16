import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { HomePostRsp } from '../../global/interface/post';

interface MasonryLayoutProps {
  snsPostUrlList: HomePostRsp[];
}

const MasonryLayout: React.FC<MasonryLayoutProps> = ({ snsPostUrlList }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const masonryLayout = () => {
    if (!containerRef.current) return;

    const masonryContainerStyle = getComputedStyle(containerRef.current);
    const columnGap = parseInt(
      masonryContainerStyle.getPropertyValue('column-gap'),
    );
    const autoRows = parseInt(
      masonryContainerStyle.getPropertyValue('grid-auto-rows'),
    );

    containerRef.current
      .querySelectorAll<HTMLDivElement>('.masonry-item')
      .forEach((elt) => {
        const pseudoImg = elt.querySelector<HTMLImageElement>('.pseudo-img');
        if (pseudoImg) {
          elt.style.gridRowEnd = `span ${Math.ceil(
            pseudoImg.scrollHeight / autoRows + columnGap / autoRows,
          )}`;
        }
      });
  };

  useEffect(() => {
    masonryLayout();
    window.addEventListener('resize', masonryLayout);
    return () => window.removeEventListener('resize', masonryLayout);
  }, []);

  return (
    <MasonryContainer ref={containerRef}>
      {snsPostUrlList.map((v, index) => (
        <MasonryItem className="masonry-item" key={index}>
          <Link to={`/${v.username}/p/${v.postId}`}>
            <PseudoImg
              className="pseudo-img"
              src={v.postContent}
              alt={`Image ${index + 1}`}
              onLoad={masonryLayout}
            />
          </Link>
        </MasonryItem>
      ))}
    </MasonryContainer>
  );
};

const MasonryContainer = styled.div`
  --gap: 10px;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(168px, 1fr));
  column-gap: var(--gap);
  grid-auto-rows: 10px;

  margin-bottom: 100px;
  padding: 0 6px;
`;

const MasonryItem = styled.div`
  margin-bottom: var(--gap);
`;

const PseudoImg = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 22px;
`;

export default MasonryLayout;
