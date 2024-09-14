import LongPressToResizeButton from 'components/common/buttton/LongPressToResizeButton';
import { POST_IMAGE_TYPE, POST_VIDEO_TYPE } from 'const/PostContentTypeConst';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MasonryPostRsp } from '../../global/interface/post';
import { getHiddenPostIdList } from '../../global/util/HiddenPostIdListUtil';

interface MasonryLayoutProps {
  snsPostUrlList: MasonryPostRsp[];
}

const MasonryLayout: React.FC<MasonryLayoutProps> = ({ snsPostUrlList }) => {
  const mansoryContentClass = 'masnory-content';
  const containerRef = useRef<HTMLDivElement>(null);

  const [hiddenPostIdList, setHiddenPostIdList] = useState<string[]>(
    getHiddenPostIdList(),
  );

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
        const pseudoImg = elt.querySelector<HTMLImageElement>(
          `.${mansoryContentClass}`,
        );
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
          {!hiddenPostIdList.includes(v.postId) && (
            <Link to={`/${v.username}/p/${v.postId}`}>
              <LongPressToResizeButton resize={0.94}>
                <PostImgAddressWrap>
                  {v.postContentType === POST_IMAGE_TYPE && (
                    <PostContentImg
                      className={mansoryContentClass}
                      src={v.postContent}
                      alt={`Image ${index + 1}`}
                      onLoad={masonryLayout}
                    />
                  )}
                  {v.postContentType === POST_VIDEO_TYPE && (
                    <PostContentVideo
                      autoPlay
                      className={mansoryContentClass}
                      muted
                      loop
                      playsInline
                      webkit-playsinline="true"
                      src={v.postContent}
                      onLoadedData={masonryLayout}
                    ></PostContentVideo>
                  )}

                  {v.location.address && (
                    <PostAddressWrap>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_131_3090)">
                          <g filter="url(#filter0_f_131_3090)">
                            <path
                              d="M8.41521 12.3167L6.97878 12.441C6.85182 12.452 6.67971 12.4582 6.50025 12.4582C6.3208 12.4582 6.14868 12.452 6.02172 12.441L4.58495 12.3167C4.2062 12.2839 3.94827 12.2421 3.84378 12.1967C3.73929 12.1512 3.79293 12.1041 3.99792 12.0612C4.20291 12.0184 4.55005 11.9818 4.99543 11.956C5.44081 11.9303 5.96443 11.9165 6.50008 11.9165C7.03573 11.9165 7.55936 11.9303 8.00474 11.956C8.45012 11.9818 8.79725 12.0184 9.00224 12.0612C9.20723 12.1041 9.26087 12.1512 9.15638 12.1967C9.05189 12.2421 8.79396 12.2839 8.41521 12.3167Z"
                              fill="#14C297"
                              fillOpacity="0.3"
                            />
                            <path
                              d="M8.41521 12.3167L6.97878 12.441C6.85182 12.452 6.67971 12.4582 6.50025 12.4582C6.3208 12.4582 6.14868 12.452 6.02172 12.441L4.58495 12.3167C4.2062 12.2839 3.94827 12.2421 3.84378 12.1967C3.73929 12.1512 3.79293 12.1041 3.99792 12.0612C4.20291 12.0184 4.55005 11.9818 4.99543 11.956C5.44081 11.9303 5.96443 11.9165 6.50008 11.9165C7.03573 11.9165 7.55936 11.9303 8.00474 11.956C8.45012 11.9818 8.79725 12.0184 9.00224 12.0612C9.20723 12.1041 9.26087 12.1512 9.15638 12.1967C9.05189 12.2421 8.79396 12.2839 8.41521 12.3167Z"
                              stroke="black"
                              strokeOpacity="0.05"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.36165 11.9071L9.94723 9.32156C10.629 8.63977 11.0933 7.77113 11.2813 6.82548C11.4694 5.87983 11.3729 4.89964 11.0039 4.00887C10.6349 3.1181 10.0101 2.35674 9.20837 1.82108C8.40669 1.28542 7.46417 0.999512 6.5 0.999512C5.53583 0.999512 4.59331 1.28542 3.79162 1.82108C2.98994 2.35674 2.3651 3.1181 1.99611 4.00887C1.62713 4.89964 1.53057 5.87983 1.71866 6.82548C1.90674 7.77113 2.37101 8.63977 3.05277 9.32156L5.63895 11.9071C5.86748 12.1354 6.17728 12.2637 6.5003 12.2637C6.82332 12.2637 7.13313 12.1354 7.36165 11.9071ZM4.67187 5.87436C4.67187 6.35921 4.86448 6.8242 5.20732 7.16704C5.55016 7.50988 6.01515 7.70248 6.5 7.70248C6.98484 7.70248 7.44983 7.50988 7.79267 7.16704C8.13551 6.8242 8.32812 6.35921 8.32812 5.87436C8.32812 5.38951 8.13551 4.92452 7.79267 4.58168C7.44983 4.23884 6.98484 4.04624 6.5 4.04624C6.01515 4.04624 5.55016 4.23884 5.20732 4.58168C4.86448 4.92452 4.67187 5.38951 4.67187 5.87436Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <filter
                            id="filter0_f_131_3090"
                            x="2.04175"
                            y="10.1665"
                            width="8.91675"
                            height="4.0415"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                          >
                            <feFlood
                              floodOpacity="0"
                              result="BackgroundImageFix"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="BackgroundImageFix"
                              result="shape"
                            />
                            <feGaussianBlur
                              stdDeviation="0.5"
                              result="effect1_foregroundBlur_131_3090"
                            />
                          </filter>
                          <clipPath id="clip0_131_3090">
                            <rect width="13" height="13" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <PostAddress>{v.location.address}</PostAddress>
                    </PostAddressWrap>
                  )}
                </PostImgAddressWrap>
              </LongPressToResizeButton>
            </Link>
          )}
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
  // @media (hover: hover) and (pointer: fine) {
  //   &:hover {
  //     filter: brightness(0.7);
  //   }
  // }
`;

const PostImgAddressWrap = styled.div`
  position: relative;
`;

const PostContentImg = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 22px;
  vertical-align: bottom;
`;

const PostContentVideo = styled.video`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 22px;
  vertical-align: bottom;
`;

const PostAddressWrap = styled.div`
  position: absolute;
  bottom: 0px;
  display: flex;
  padding: 0 0 9px 8px;
`;

const PostAddress = styled.div`
  font: ${({ theme }) => theme.fontSizes.Location2};
  color: ${({ theme }) => theme.mainColor.White};
`;

export default MasonryLayout;
